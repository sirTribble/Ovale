/*////////////////////////////////////////////////////////////////////
    Copyright (C) 2014 Johnny C. Lam.
    See the file LICENSE.txt for copying permission.
//*/

/*////////////////////////////////////////////////////////////////////////////
	This module implements a parser that generates an abstract syntax tree (AST)
	from an Ovale script.

	An AST data structure is a table with the following public properties.

		ast.annotation
		ast.annotation.customFunction
		ast.annotation.definition
		ast.annotation.functionCall
		ast.child
//*/

var OVALE = "Ovale"
import { ovale } from './Ovale';
import { L } from './Localization';
import { OvalePool } from './Pool';
import { ovaleProfiler } from './Profiler';
import { ovaleStance } from './Stance';
import { format, gsub, next, rawset, strlower, strsub, tconcat, tinsert, tonumber, tostring, sort, type, wipe, GetItemInfo, len } from 'stub';

// Forward declarations for module dependencies.
var OvaleCondition = null
var OvaleLexer = null
var OvaleScripts = null
var OvaleSpellBook = null


// Keywords for the Ovale script language.
var KEYWORD = {
	["and"] : true,
	["if"] : true,
	["not"] : true,
	["or"] : true,
	["unless"] : true,
}

var DECLARATION_KEYWORD = {
	["AddActionIcon"] : true,
	["AddCheckBox"] : true,
	["AddFunction"] : true,
	["AddIcon"] : true,
	["AddListItem"] : true,
	["Define"] : true,
	["Include"] : true,
	["ItemInfo"] : true,
	["ItemList"] : true,
	["ScoreSpells"] : true,
	["SpellInfo"] : true,
	["SpellList"] : true,
	["SpellRequire"] : true,
}

var PARAMETER_KEYWORD = {
	["checkbox"] : true,
	["help"] : true,
	["if_buff"] : true,
	["if_spell"] : true,
	["if_stance"] : true,
	["if_target_debuff"] : true,
	["itemcount"] : true,
	["itemset"] : true,
	["level"] : true,
	["listitem"] : true,
	["specialization"] : true,
	["talent"] : true,
	["text"] : true,
	["wait"] : true,
}

var SPELL_AURA_KEYWORD = {
	["SpellAddBuff"] : true,
	["SpellAddDebuff"] : true,
	["SpellAddPetBuff"] : true,
	["SpellAddPetDebuff"] : true,
	["SpellAddTargetBuff"] : true,
	["SpellAddTargetDebuff"] : true,
	["SpellDamageBuff"] : true,
	["SpellDamageDebuff"] : true,
}

var STANCE_KEYWORD = {
	["if_stance"] : true,
	["stance"] : true,
	["to_stance"] : true,
}

// SpellAuraList keywords are declaration keywords.
for (let keyword in SPELL_AURA_KEYWORD) {
	DECLARATION_KEYWORD[keyword] = SPELL_AURA_KEYWORD[keyword];
}
// All keywords are Ovale script keywords.
for (let keyword in DECLARATION_KEYWORD) {
	KEYWORD[keyword] = DECLARATION_KEYWORD[keyword]
}
for (let keyword in PARAMETER_KEYWORD) {
	KEYWORD[keyword] = PARAMETER_KEYWORD[keyword]
}

// Table of pattern/tokenizer pairs for the Ovale script language.
var MATCHES = null

// Functions that are actions; ACTION_PARAMETER_COUNT[action] = number of required parameters
var ACTION_PARAMETER_COUNT = {
	["item"] : 1,
	["macro"] : 1,
	["spell"] : 1,
	["texture"] : 1,
	["setstate"] : 2,
}

// Actions that are special "state" actions && return no other relevant action information.
var STATE_ACTION = {
	["setstate"] : true,
}
// Functions for accessing string databases.
var STRING_LOOKUP_FUNCTION = {
	["ItemName"] : true,
	["L"] : true,
	["SpellName"] : true,
}

// Unary && binary operators with precedence.
var UNARY_OPERATOR:LuaDictionary<{type:string, precedence:number}> = {
	["!"] : { type: "logical", precedence: 15 },
	["-"] : { type: "arithmetic", precedence: 50 },
}
var BINARY_OPERATOR:LuaDictionary<{type: string, precedence: number, format?: string }> = {
	// logical
	["||"]  : {type: "logical", precedence: 5, format: "associative" },
	["xor"]: {type: "logical", precedence: 8, format: "associative" },
	["&&"] : {type: "logical", precedence: 10, format: "associative" },
	// comparison
	["!:"]  : {type:"compare", precedence: 20 },
	["<"]   : {type: "compare", precedence: 20 },
	["<:"]  : {type: "compare", precedence: 20 },
	["::"]  : {type: "compare", precedence: 20 },
	[">"]   : {type: "compare", precedence: 20 },
	[">:"]  : { type:"compare", precedence: 20 },
	// addition, subtraction
	["+"]   : { type: "arithmetic", precedence: 30, format: "associative" },
	["-"]   : { type: "arithmetic", precedence: 30 },
	// multiplication, division, modulus
	["%"]   : { type: "arithmetic", precedence: 40 },
	["*"]   : { type:"arithmetic", precedence: 40, format: "associative" },
	["/"]   : { type: "arithmetic", precedence: 40 },
	// exponentiation
	["^"]   : {  type: "arithmetic", precedence: 100 },
}

// INDENT[k] is a string of k concatenated tabs.
var indent = {}
indent[0] = "";
function getIndent(tabs: number) {
	if (!indent[tabs]) {
		indent[tabs] = getIndent(tabs - 1) + "\t";
	}
	return indent[tabs];
}

interface Node {
	child: Node;
	postOrder: Node;
	nodeId: number;
}

interface Ast {
	annotation: {
		definition: {},
		nameReference: LuaDictionary<Node>
	}
}

var self_indent = 0
var self_outputPool = new OvalePool<any>("OvaleAST_outputPool")
var self_controlPool = new OvalePool<any>("OvaleAST_controlPool")
var self_parametersPool = new OvalePool("OvaleAST_parametersPool")
var self_childrenPool = new OvalePool<Node>("OvaleAST_childrenPool")
var self_postOrderPool = new OvalePool<any>("OvaleAST_postOrderPool")
var self_pool = new OvalePool<Node>("OvaleAST_pool")

self_pool.clean = function(node) {
	if ( node.child ) {
		self_childrenPool.Release(node.child)
		node.child = null
	}
	if ( node.postOrder ) {
		self_postOrderPool.Release(node.postOrder)
		node.postOrder = null
	}
}

//</private-static-properties>

//<private-static-methods>
// Implementation of PHP-like print_r() taken from http.//lua-users.org/wiki/TableSerialization.
// This is used to print out a table, but has been modified to print out an AST.
function print_r(node:Node, indent?:string, done?:LuaDictionary<boolean>, output?: LuaTable<string>) {
	done = done || {}
	output = output || {}
	indent = indent || ''
	for (var key in node) {
		var value = node[key];
		if ( type(value) == "object" ) {
			if ( done[value] ) {
				tinsert(output, indent + "[" + tostring(key) + "] => (self_reference)")
			} else {
				// Shortcut conditional allocation
				done[value] = true
				if ( value.type ) {
					tinsert(output, indent + "[" + tostring(key) + "] =>")
				} else {
					tinsert(output, indent + "[" + tostring(key) + "] => {")
				}
				print_r(value, indent + "    ", done, output)
				if ( !value.type ) {
					tinsert(output, indent + "}")
				}
			}
		} else {
			tinsert(output, indent + "[" + tostring(key) + "] => " + tostring(value))
		}
	}
	return output
}


	// Get a new node from the pool && save it in the nodes array.
function NewNode(nodeList:LuaTable<Node>, hasChild?:boolean) {
	var node = self_pool.Get()
	if ( nodeList ) {
		var nodeId = tlen(nodeList) + 1
		node.nodeId = nodeId
		nodeList[nodeId] = node
	}
	if ( hasChild ) {
		node.child = self_childrenPool.Get()
	}
	return node
}

// Follow the flyweight pattern for number nodes.
function GetNumberNode(value, nodeList, annotation) {
	// Check for a flyweight node with this exact numerical value.
	annotation.numberFlyweight = annotation.numberFlyweight || {}
	var node = annotation.numberFlyweight[value]
	if ( !node ) {
		node = ovaleAST.NewNode(nodeList)
		node.type = "value"
		node.value = value
		node.origin = 0
		node.rate = 0
		// Store the first node with this exact numerical value in numberFlyweight.
		annotation.numberFlyweight[value] = node
	}
	return node
}

/*
	Fill an array of nodes in order of post-order traversal.
	The odd indices hold the nodes in post-order traversal order.
	The even indices hold the parents of the node in the preceding indices.
//*/
function PostOrderTraversal(node, array, visited) {
	if ( node.child ) {
		for ( _, childNode in ipairs(node.child) ) {
			if ( !visited[childNode] ) {
				PostOrderTraversal(childNode, array, visited)
				// Insert the current node as the parent of the preceding child node.
				tinsert(array,  node)
			}
		}
	}
	tinsert(array,  node)
	visited[node] = true
}

/*////////////////////////////////////////////-
	Lexer functions (for use with OvaleLexer)
//*/
function TokenizeComment(token) {
	return yield("comment", token)
}

function TokenizeLua(token, options) {
	// Strip off leading [[ && trailing */.
	token = strsub(token, 3, -3)
	return yield("lua", token)
}

function TokenizeName(token) {
	if ( KEYWORD[token] ) {
		return yield("keyword", token)
	} else {
		return yield("name", token)
	}
}

function TokenizeNumber(token, options) {
	if ( options && options.number ) {
		token = tonumber(token)
	}
	return yield("number", token)
}

function TokenizeString(token, options) {
	// Strip leading && trailing quote characters.
	if ( options && options.string ) {
		token = strsub(token, 2, -2)
	}
	return yield("string", token)
}

function TokenizeWhitespace(token) {
	return yield("space", token)
}

function Tokenize(token) {
	return yield(token, token)
}

function NoToken() {
	return yield(null)
}

var MATCHES = [
		{ regex: "^%s+", callback: TokenizeWhitespace },
		{ regex: "^%d+%.?%d*", callback: TokenizeNumber },
		{ regex: "^[%a_][%w_]*", callback: TokenizeName },
		{ regex: "^((['\"])%2)", callback:  TokenizeString },	// empty string
		{ regex:  "^(['\"]).-\\%1*/", callback:  TokenizeString },
		{ regex: "^(['\"]).-[^\]%1*/", callback:  TokenizeString },
		{ regex: "^tlen(.)-\n", callback:  TokenizeComment },
		{ regex: "^!=", callback:  Tokenize },
		{ regex: "^==", callback:  Tokenize },
		{ regex: "^<=", callback:  Tokenize },
		{ regex: "^>=", callback: Tokenize },
		{ regex: "^.", callback:  Tokenize },
		{ regex:  "^$", callback:  NoToken },
		]


function GetTokenIterator(s) {
	var exclude = { space : true, comments : true }
	
	// Fix some API brokenness in the Penlight lexer.
	if ( exclude.space ) {
		exclude[TokenizeWhitespace] = true
	}
	if ( exclude.comments ) {
		exclude[TokenizeComment] = true
	}
	
	return OvaleLexer.scan(s, MATCHES, exclude)
}

// "Flatten" a parameter value node into a string, || a table of strings if it is a comma-separated value.
function FlattenParameterValue(parameterValue, annotation) {
	var value = parameterValue
	if ( type(parameterValue) == "table" ) {
		var node = parameterValue
		if ( node.type == "comma_separated_values" ) {
			value = self_parametersPool.Get()
			for ( k, v in ipairs(node.csv) ) {
				value[k] = FlattenParameterValue(v, annotation)
			}
			annotation.parametersList = annotation.parametersList || {}
			tinsert(annotation.parametersList,  value)
		} else {
			var isBang = false
			if ( node.type == "bang_value" ) {
				isBang = true
				node = node.child[1]
			}
			if ( node.type == "value" ) {
				value = node.value
			} else if ( node.type == "variable" ) {
				value = node.name
			} else if ( node.type == "string" ) {
				value = node.value
			}
			if ( isBang ) {
				value = "!" + tostring(value)
			}
		}
	}
	return value
}

/*////////////////////////
	"Unparser" functions
//*/

// Return the precedence of an operator in the given node.
// Returns null if the node is !an expression node.
function GetPrecedence(node) {
	var precedence = node.precedence
	if ( !precedence ) {
		var operator = node.operator
		if ( operator ) {
			if ( node.expressionType == "unary" && UNARY_OPERATOR[operator] ) {
				precedence = UNARY_OPERATOR[operator].precedence
			} else if ( node.expressionType == "binary" && BINARY_OPERATOR[operator] ) {
				precedence = BINARY_OPERATOR[operator].precedence
			}
		}
	}
	return precedence
}

function HasParameters(node) {
	return node.rawPositionalParams && next(node.rawPositionalParams) || node.rawNamedParams && next(node.rawNamedParams)
}

// Forward declarations of functions needed to implement the recursive unparser.
var UNPARSE_VISITOR = null
var Unparse = null
var UnparseAddCheckBox = null
var UnparseAddFunction = null
var UnparseAddIcon = null
var UnparseAddListItem = null
var UnparseBangValue = null
var UnparseComment = null
var UnparseCommaSeparatedValues = null
var UnparseDefine = null
var UnparseExpression = null
var UnparseFunction = null
var UnparseGroup = null
var UnparseIf = null
var UnparseItemInfo = null
var UnparseList = null
var UnparseNumber = null
var UnparseParameters = null
var UnparseScoreSpells = null
var UnparseScript = null
var UnparseSpellAuraList = null
var UnparseSpellInfo = null
var UnparseSpellRequire = null
var UnparseString = null
var UnparseUnless = null
var UnparseVariable = null

Unparse = function(node) {
	if ( node.asString ) {
		// Return cached string representation if present.
		return node.asString
	} else {
		var visitor
		if ( node.previousType ) {
			visitor = UNPARSE_VISITOR[node.previousType]
		} else {
			visitor = UNPARSE_VISITOR[node.type]
		}
		if ( !visitor ) {
			OvaleAST.Error("Unable to unparse node of type '%s'.", node.type)
		} else {
			return visitor(node)
		}
	}
}

UnparseAddCheckBox = function(node) {
	var s
	if ( node.rawPositionalParams && next(node.rawPositionalParams) || node.rawNamedParams && next(node.rawNamedParams) ) {
		s = format("AddCheckBox(%s %s %s)", node.name, Unparse(node.description), UnparseParameters(node.rawPositionalParams, node.rawNamedParams))
	} else {
		s = format("AddCheckBox(%s %s)", node.name, Unparse(node.description))
	}
	return s
}

UnparseAddFunction = function(node) {
	var s
	if ( HasParameters(node) ) {
		s = format("AddFunction %s %s%s", node.name, UnparseParameters(node.rawPositionalParams, node.rawNamedParams), UnparseGroup(node.child[1]))
	} else {
		s = format("AddFunction %s%s", node.name, UnparseGroup(node.child[1]))
	}
	return s
}

UnparseAddIcon = function(node) {
	var s
	if ( HasParameters(node) ) {
		s = format("AddIcon %s%s", UnparseParameters(node.rawPositionalParams, node.rawNamedParams), UnparseGroup(node.child[1]))
	} else {
		s = format("AddIcon%s", UnparseGroup(node.child[1]))
	}
	return s
}

UnparseAddListItem = function(node) {
	var s
	if ( HasParameters(node) ) {
		s = format("AddListItem(%s %s %s %s)", node.name, node.item, Unparse(node.description), UnparseParameters(node.rawPositionalParams, node.rawNamedParams))
	} else {
		s = format("AddListItem(%s %s %s)", node.name, node.item, Unparse(node.description))
	}
	return s
}

UnparseBangValue = function(node) {
	return "!" + Unparse(node.child[1])
}

UnparseComment = function(node) {
	if ( !node.comment || node.comment == "" ) {
		return ""
	} else {
		return "#" + node.comment
	}
}

UnparseCommaSeparatedValues = function(node) {
	var output = self_outputPool.Get()
	for ( k, v in ipairs(node.csv) ) {
		output[k] = Unparse(v)
	}
	var outputString = tconcat(output, ",")
	self_outputPool.Release(output)
	return outputString
}

UnparseDefine = function(node) {
	return format("Define(%s %s)", node.name, node.value)
}

UnparseExpression = function(node) {
	var expression
	var precedence = GetPrecedence(node)
	if ( node.expressionType == "unary" ) {
		var rhsExpression
		var rhsNode = node.child[1]
		var rhsPrecedence = GetPrecedence(rhsNode)
		if ( rhsPrecedence && precedence >= rhsPrecedence ) {
			rhsExpression = "{ " + Unparse(rhsNode) + " }"
		} else {
			rhsExpression = Unparse(rhsNode)
		}
		if ( node.operator == "-" ) {
			expression = "-" + rhsExpression
		} else {
			expression = node.operator + " " + rhsExpression
		}
	} else if ( node.expressionType == "binary" ) {
		var lhsExpression, rhsExpression
		var lhsNode = node.child[1]
		var lhsPrecedence = GetPrecedence(lhsNode)
		if ( lhsPrecedence && lhsPrecedence < precedence ) {
			lhsExpression = "{ " + Unparse(lhsNode) + " }"
		} else {
			lhsExpression = Unparse(lhsNode)
		}
		var rhsNode = node.child[2]
		var rhsPrecedence = GetPrecedence(rhsNode)
		if ( rhsPrecedence && precedence > rhsPrecedence ) {
			rhsExpression = "{ " + Unparse(rhsNode) + " }"
		} else if ( rhsPrecedence && precedence == rhsPrecedence ) {
			if ( BINARY_OPERATOR[node.operator][3] == "associative" && node.operator == rhsNode.operator ) {
				rhsExpression = Unparse(rhsNode)
			} else {
				rhsExpression = "{ " + Unparse(rhsNode) + " }"
			}
		} else {
			rhsExpression = Unparse(rhsNode)
		}
		expression = lhsExpression + " " + node.operator + " " + rhsExpression
	}
	return expression
}

UnparseFunction = function(node) {
	var s
	if ( HasParameters(node) ) {
		var name
		var filter = node.rawNamedParams.filter
		if ( filter == "debuff" ) {
			name = gsub(node.name, "^Buff", "Debuff")
		} else {
			name = node.name
		}
		var target = node.rawNamedParams.target
		if ( target ) {
			s = format("%s.%s(%s)", target, name, UnparseParameters(node.rawPositionalParams, node.rawNamedParams))
		} else {
			s = format("%s(%s)", name, UnparseParameters(node.rawPositionalParams, node.rawNamedParams))
		}
	} else {
		s = format("%s()", node.name)
	}
	return s
}

UnparseGroup = function(node) {
	var output = self_outputPool.Get()
	tinsert(output,  "")
	tinsert(output,  INDENT[self_indent] + "{")
	self_indent = self_indent + 1
	for ( _, statementNode in ipairs(node.child) ) {
		var s = Unparse(statementNode)
		if ( s == "" ) {
			tinsert(output,  s)
		} else {
			tinsert(output,  INDENT[self_indent] + s)
		}
	}
	self_indent = self_indent - 1
	tinsert(output,  INDENT[self_indent] + "}")

	var outputString = tconcat(output, "\n")
	self_outputPool.Release(output)
	return outputString
}

UnparseIf = function(node) {
	if ( node.child[2].type == "group" ) {
		return format("if %s%s", Unparse(node.child[1]), UnparseGroup(node.child[2]))
	} else {
		return format("if %s %s", Unparse(node.child[1]), Unparse(node.child[2]))
	}
}

UnparseItemInfo = function(node) {
	var identifier = node.name && node.name || node.itemId
	return format("ItemInfo(%s %s)", identifier, UnparseParameters(node.rawPositionalParams, node.rawNamedParams))
}

UnparseList = function(node) {
	return format("%s(%s %s)", node.keyword, node.name, UnparseParameters(node.rawPositionalParams, node.rawNamedParams))
}

UnparseNumber = function(node) {
	return tostring(node.value)
}

UnparseParameters = function(positionalParams, namedParams) {
	var output = self_outputPool.Get()
	for ( k, v in pairs(namedParams) ) {
		if ( k == "checkbox" ) {
			for ( _, name in ipairs(v) ) {
				tinsert(output,  format("checkbox=%s", Unparse(name)))
			}
		} else if ( k == "listitem" ) {
			for ( list, item in pairs(v) ) {
				tinsert(output,  format("listitem=%s.%s", list, Unparse(item)))
			}
		} else if ( type(v) == "table" ) {
			tinsert(output,  format("%s=%s", k, Unparse(v)))
		} else if ( k == "filter" || k == "target" ) {
			// Skip output of "filter" || "target".
		} else {
			tinsert(output,  format("%s=%s", k, v))
		}
	}
	tsort(output)
	for ( k = tlen(positionalParams), 1, -1 ) {
		tinsert(output, 1, Unparse(positionalParams[k]))
	}
	var outputString = tconcat(output, " ")
	self_outputPool.Release(output)
	return outputString
}

UnparseScoreSpells = function(node) {
	return format("ScoreSpells(%s)", UnparseParameters(node.rawPositionalParams, node.rawNamedParams))
}

UnparseScript = function(node) {
	var output = self_outputPool.Get()
	var previousDeclarationType
	for ( _, declarationNode in ipairs(node.child) ) {
		if ( declarationNode.type == "item_info" || declarationNode.type == "spell_aura_list" || declarationNode.type == "spell_info" || declarationNode.type == "spell_require" ) {
			var s = Unparse(declarationNode)
			if ( s == "" ) {
				tinsert(output,  s)
			} else {
				tinsert(output,  INDENT[self_indent + 1] + s)
			}
		} else {
			var insertBlank = false
			// Add an extra blank line if the type is different from the previous type.
			if ( previousDeclarationType && previousDeclarationType != declarationNode.type ) {
				insertBlank = true
			}
			// Always an extra blank line preceding "AddFunction" || "AddIcon".
			if ( declarationNode.type == "add_function" || declarationNode.type == "icon" ) {
				insertBlank = true
			}
			if ( insertBlank ) {
				tinsert(output,  "")
			}
			tinsert(output,  Unparse(declarationNode))
			previousDeclarationType = declarationNode.type
		}
	}
	var outputString = tconcat(output, "\n")
	self_outputPool.Release(output)
	return outputString
}

UnparseSpellAuraList = function(node) {
	var identifier = node.name && node.name || node.spellId
	return format("%s(%s %s)", node.keyword, identifier, UnparseParameters(node.rawPositionalParams, node.rawNamedParams))
}

UnparseSpellInfo = function(node) {
	var identifier = node.name && node.name || node.spellId
	return format("SpellInfo(%s %s)", identifier, UnparseParameters(node.rawPositionalParams, node.rawNamedParams))
}

UnparseSpellRequire = function(node) {
	var identifier = node.name && node.name || node.spellId
	return format("SpellRequire(%s %s %s)", identifier, node.property, UnparseParameters(node.rawPositionalParams, node.rawNamedParams))
}

UnparseString = function(node) {
	return '"' + node.value + '"'
}

UnparseUnless = function(node) {
	if ( node.child[2].type == "group" ) {
		return format("unless %s%s", Unparse(node.child[1]), UnparseGroup(node.child[2]))
	} else {
		return format("unless %s %s", Unparse(node.child[1]), Unparse(node.child[2]))
	}
}

UnparseVariable = function(node) {
	return node.name
}

{
	UNPARSE_VISITOR = {
		["action"] : UnparseFunction,
		["add_function"] : UnparseAddFunction,
		["arithmetic"] : UnparseExpression,
		["bang_value"] : UnparseBangValue,
		["checkbox"] : UnparseAddCheckBox,
		["compare"] : UnparseExpression,
		["comma_separated_values"] : UnparseCommaSeparatedValues,
		["comment"] : UnparseComment,
		["custom_function"] : UnparseFunction,
		["define"] : UnparseDefine,
		["function"] : UnparseFunction,
		["group"] : UnparseGroup,
		["icon"] : UnparseAddIcon,
		["if"] : UnparseIf,
		["item_info"] : UnparseItemInfo,
		["list"] : UnparseList,
		["list_item"] : UnparseAddListItem,
		["logical"] : UnparseExpression,
		["score_spells"] : UnparseScoreSpells,
		["script"] : UnparseScript,
		["spell_aura_list"] : UnparseSpellAuraList,
		["spell_info"] : UnparseSpellInfo,
		["spell_require"] : UnparseSpellRequire,
		["state"] : UnparseFunction,
		["string"] : UnparseString,
		["unless"] : UnparseUnless,
		["value"] : UnparseNumber,
		["variable"] : UnparseVariable,
	}
}

/*////////////////////
	Parser functions
//*/

// Prints the error message && the next 20 tokens from tokenStream.
function SyntaxError(tokenStream, ...) {
	OvaleAST.Print(...)
	var context = { "Next tokens." }
	for ( i = 1, 20 ) {
		var tokenType, token = tokenStream.Peek(i)
		if ( tokenType ) {
			tinsert(context,  token)
		} else {
			tinsert(context,  "<EOS>")
			break
		}
	}
	OvaleAST.Print(tconcat(context, " "))
}

// Forward declarations of parser functions needed to implement a recursive descent parser.
var PARSE_VISITOR = null
var Parse = null
var ParseAddCheckBox = null
var ParseAddFunction = null
var ParseAddIcon = null
var ParseAddListItem = null
var ParseDeclaration = null
var ParseDefine = null
var ParseExpression = null
var ParseFunction = null
var ParseGroup = null
var ParseIf = null
var ParseInclude = null
var ParseItemInfo = null
var ParseList = null
var ParseNumber = null
var ParseParameterValue = null
var ParseParameters = null
var ParseParentheses = null
var ParseScoreSpells = null
var ParseScript = null
var ParseSimpleExpression = null
var ParseSimpleParameterValue = null
var ParseSpellAuraList = null
var ParseSpellInfo = null
var ParseSpellRequire = null
var ParseString = null
var ParseStatement = null
var ParseUnless = null
var ParseVariable = null

Parse = function(nodeType, tokenStream, nodeList, annotation) {
	var visitor = PARSE_VISITOR[nodeType]
	if ( !visitor ) {
		OvaleAST.Error("Unable to parse node of type '%s'.", nodeType)
	} else {
		return visitor(tokenStream, nodeList, annotation)
	}
}

ParseAddCheckBox = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the 'AddCheckBox' token.
	{
		var tokenType, token = tokenStream.Consume()
		if ( !(tokenType == "keyword" && token == "AddCheckBox") ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDCHECKBOX; 'AddCheckBox' expected.", token)
			ok = false
		}
	}
	// Consume the left parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "(" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDCHECKBOX; '(' expected.", token)
			ok = false
		}
	}
	// Consume the checkbox name.
	var name
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "name" ) {
			name = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDCHECKBOX; name expected.", token)
			ok = false
		}
	}
	// Consume the description string.
	var descriptionNode
	if ( ok ) {
		ok, descriptionNode = ParseString(tokenStream, nodeList, annotation)
	}
	// Consume any parameters.
	var parameters
	var positionalParams, namedParams
	if ( ok ) {
		ok, positionalParams, namedParams = ParseParameters(tokenStream, nodeList, annotation)
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != ")" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDCHECKBOX; ')' expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "checkbox"
		node.name = name
		node.description = descriptionNode
		node.rawPositionalParams = positionalParams
		node.rawNamedParams = namedParams
		annotation.parametersReference = annotation.parametersReference || {}
		tinsert(annotation.parametersReference,  node)
	}
	return ok, node
}

ParseAddFunction = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the 'AddFunction' token.
	var tokenType, token = tokenStream.Consume()
	if ( !(tokenType == "keyword" && token == "AddFunction") ) {
		SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDFUNCTION; 'AddFunction' expected.", token)
		ok = false
	}
	// Consume the function name. {
	var name
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "name" ) {
			name = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDFUNCTION; name expected.", token)
			ok = false
		}
	}
	// Consume any parameters.
	var positionalParams, namedParams
	if ( ok ) {
		ok, positionalParams, namedParams = ParseParameters(tokenStream, nodeList, annotation)
	}
	// Consume the body.
	var bodyNode
	if ( ok ) {
		ok, bodyNode = ParseGroup(tokenStream, nodeList, annotation)
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList, true)
		node.type = "add_function"
		node.name = name
		node.child[1] = bodyNode
		node.rawPositionalParams = positionalParams
		node.rawNamedParams = namedParams
		annotation.parametersReference = annotation.parametersReference || {}
		tinsert(annotation.parametersReference,  node)
		// Add the postOrder list to the body node.
		annotation.postOrderReference = annotation.postOrderReference || {}
		tinsert(annotation.postOrderReference,  bodyNode)
		annotation.customFunction = annotation.customFunction || {}
		annotation.customFunction[name] = node
	}
	return ok, node
}

ParseAddIcon = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the 'AddIcon' token.
	var tokenType, token = tokenStream.Consume()
	if ( !(tokenType == "keyword" && token == "AddIcon") ) {
		SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDICON; 'AddIcon' expected.", token)
		ok = false
	}
	// Consume any parameters.
	var positionalParams, namedParams
	if ( ok ) {
		ok, positionalParams, namedParams = ParseParameters(tokenStream, nodeList, annotation)
	}
	// Consume the body.
	var bodyNode
	if ( ok ) {
		ok, bodyNode = ParseGroup(tokenStream, nodeList, annotation)
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList, true)
		node.type = "icon"
		node.child[1] = bodyNode
		node.rawPositionalParams = positionalParams
		node.rawNamedParams = namedParams
		annotation.parametersReference = annotation.parametersReference || {}
		tinsert(annotation.parametersReference,  node)
		// Add the postOrder list to the body node.
		annotation.postOrderReference = annotation.postOrderReference || {}
		tinsert(annotation.postOrderReference,  bodyNode)
	}
	return ok, node
}

ParseAddListItem = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the 'AddListItem' token.
	{
		var tokenType, token = tokenStream.Consume()
		if ( !(tokenType == "keyword" && token == "AddListItem") ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDLISTITEM; 'AddListItem' expected.", token)
			ok = false
		}
	}
	// Consume the left parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "(" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDLISTITEM; '(' expected.", token)
			ok = false
		}
	}
	// Consume the list name.
	var name
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "name" ) {
			name = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDLISTITEM; name expected.", token)
			ok = false
		}
	}
	// Consume the item name.
	var item
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "name" ) {
			item = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDLISTITEM; name expected.", token)
			ok = false
		}
	}
	// Consume the description string.
	var descriptionNode
	if ( ok ) {
		ok, descriptionNode = ParseString(tokenStream, nodeList, annotation)
	}
	// Consume any parameters.
	var positionalParams, namedParams
	if ( ok ) {
		ok, positionalParams, namedParams = ParseParameters(tokenStream, nodeList, annotation)
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != ")" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ADDLISTITEM; ')' expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "list_item"
		node.name = name
		node.item = item
		node.description = descriptionNode
		node.rawPositionalParams = positionalParams
		node.rawNamedParams = namedParams
		annotation.parametersReference = annotation.parametersReference || {}
		tinsert(annotation.parametersReference,  node)
	}
	return ok, node
}

ParseDeclaration = function(tokenStream, nodeList, annotation) {
	var ok = true
	var node
	var tokenType, token = tokenStream.Peek()
	if ( tokenType == "keyword" && DECLARATION_KEYWORD[token] ) {
		if ( token == "AddCheckBox" ) {
			ok, node = ParseAddCheckBox(tokenStream, nodeList, annotation)
		} else if ( token == "AddFunction" ) {
			ok, node = ParseAddFunction(tokenStream, nodeList, annotation)
		} else if ( token == "AddIcon" ) {
			ok, node = ParseAddIcon(tokenStream, nodeList, annotation)
		} else if ( token == "AddListItem" ) {
			ok, node = ParseAddListItem(tokenStream, nodeList, annotation)
		} else if ( token == "Define" ) {
			ok, node = ParseDefine(tokenStream, nodeList, annotation)
		} else if ( token == "Include" ) {
			ok, node = ParseInclude(tokenStream, nodeList, annotation)
		} else if ( token == "ItemInfo" ) {
			ok, node = ParseItemInfo(tokenStream, nodeList, annotation)
		} else if ( token == "ItemList" ) {
			ok, node = ParseList(tokenStream, nodeList, annotation)
		} else if ( token == "ScoreSpells" ) {
			ok, node = ParseScoreSpells(tokenStream, nodeList, annotation)
		} else if ( SPELL_AURA_KEYWORD[token] ) {
			ok, node = ParseSpellAuraList(tokenStream, nodeList, annotation)
		} else if ( token == "SpellInfo" ) {
			ok, node = ParseSpellInfo(tokenStream, nodeList, annotation)
		} else if ( token == "SpellList" ) {
			ok, node = ParseList(tokenStream, nodeList, annotation)
		} else if ( token == "SpellRequire" ) {
			ok, node = ParseSpellRequire(tokenStream, nodeList, annotation)
		}
	} else {
		SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing DECLARATION; declaration keyword expected.", token)
		tokenStream.Consume()
		ok = false
	}
	return ok, node
}

ParseDefine = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the 'Define' token.
	{
		var tokenType, token = tokenStream.Consume()
		if ( !(tokenType == "keyword" && token == "Define") ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing DEFINE; 'Define' expected.", token)
			ok = false
		}
	}
	// Consume the left parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "(" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing DEFINE; '(' expected.", token)
			ok = false
		}
	}
	// Consume the variable name.
	var name
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "name" ) {
			name = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing DEFINE; name expected.", token)
			ok = false
		}
	}
	// Consume the value.
	var value
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "-" ) {
			// Negative number.
			tokenType, token = tokenStream.Consume()
			if ( tokenType == "number" ) {
				// Elide the unary negation operator into the number.
				value = -1 * tonumber(token)
			} else {
				SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing DEFINE; number expected after '-'.", token)
				ok = false
			}
		} else if ( tokenType == "number" ) {
			value = tonumber(token)
		} else if ( tokenType == "string" ) {
			value = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing DEFINE; number || string expected.", token)
			ok = false
		}
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != ")" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing DEFINE; ')' expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "define"
		node.name = name
		node.value = value
		annotation.definition = annotation.definition || {}
		annotation.definition[name] = value
	}
	return ok, node
}

/*
	Operator-precedence parser for logical && arithmetic expressions.
	Implementation taken from Wikipedia.
		http.//en.wikipedia.org/wiki/Operator-precedence_parser
//*/
ParseExpression = function(tokenStream, nodeList, annotation, minPrecedence) {
	minPrecedence = minPrecedence || 0
	var ok = true
	var node

	// Check for unary operator expressions first as they decorate the underlying expression.
	{
		var tokenType, token = tokenStream.Peek()
		if ( tokenType ) {
			var opInfo = UNARY_OPERATOR[token]
			if ( opInfo ) {
				var opType, precedence = opInfo[1], opInfo[2]
				tokenStream.Consume()
				var operator = token
				var rhsNode
				ok, rhsNode = ParseExpression(tokenStream, nodeList, annotation, precedence)
				if ( ok ) {
					if ( operator == "-" && rhsNode.type == "value" ) {
						// Elide the unary negation operator into the number.
						var value = -1 * rhsNode.value
						node = GetNumberNode(value, nodeList, annotation)
					} else {
						node = OvaleAST.NewNode(nodeList, true)
						node.type = opType
						node.expressionType = "unary"
						node.operator = operator
						node.precedence = precedence
						node.child[1] = rhsNode
					}
				}
			} else {
				ok, node = ParseSimpleExpression(tokenStream, nodeList, annotation)
			}
		}
	}

	// Peek at the next token to see if it is a binary operator.
	while ( ok ) {
		var keepScanning = false
		var tokenType, token = tokenStream.Peek()
		if ( tokenType ) {
			var opInfo = BINARY_OPERATOR[token]
			if ( opInfo ) {
				var opType, precedence = opInfo[1], opInfo[2]
				if ( precedence && precedence > minPrecedence ) {
					keepScanning = true
					tokenStream.Consume()
					var operator = token
					var lhsNode = node
					var rhsNode
					ok, rhsNode = ParseExpression(tokenStream, nodeList, annotation, precedence)
					if ( ok ) {
						node = OvaleAST.NewNode(nodeList, true)
						node.type = opType
						node.expressionType = "binary"
						node.operator = operator
						node.precedence = precedence
						node.child[1] = lhsNode
						node.child[2] = rhsNode
						// Left-rotate tree to preserve precedence.
						var rotated = false
						while ( node.type == rhsNode.type && node.operator == rhsNode.operator && BINARY_OPERATOR[node.operator][3] == "associative" && rhsNode.expressionType == "binary" ) {
							node.child[2] = rhsNode.child[1]
							rhsNode.child[1] = node
							// Re-cache the string representation for the new LHS node.
							node.asString = UnparseExpression(node)
							// Re-assign node && RHS node for the following loop.
							node = rhsNode
							rhsNode = node.child[2]
							rotated = true
						}
						if ( rotated ) {
							// Re-cache the string representation for the new top-level expression node.
							node.asString = UnparseExpression(node)
						}
					}
				}
			}
		}
		if ( !keepScanning ) {
			break
		}
	}

	if ( ok && node ) {
		// Cache string representation.
		node.asString = node.asString || Unparse(node)
	}
	return ok, node
}

ParseFunction = function(tokenStream, nodeList, annotation) {
	var ok = true
	var name, lowername
	// Consume the name.
	{
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "name" ) {
			name = token
			lowername = strlower(name)
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing FUNCTION; name expected.", token)
			ok = false
		}
	}
	// Check for <target>.<function>. {
	var target
	if ( ok ) {
		var tokenType, token = tokenStream.Peek()
		if ( tokenType == "." ) {
			target = name
			tokenType, token = tokenStream.Consume(2)
			if ( tokenType == "name" ) {
				name = token
				lowername = strlower(name)
			} else {
				SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing FUNCTION; name expected.", token)
				ok = false
			}
		}
	}
	// Consume the left parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "(" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing FUNCTION; '(' expected.", token)
			ok = false
		}
	}
	// Consume any function parameters. {
	var positionalParams, namedParams
	if ( ok ) {
		ok, positionalParams, namedParams = ParseParameters(tokenStream, nodeList, annotation)
	}
	// Verify that an action has the required number of fixed parameters.
	if ( ok && ACTION_PARAMETER_COUNT[lowername] ) {
		var count = ACTION_PARAMETER_COUNT[lowername]
		if ( count > tlen(positionalParams) ) {
			SyntaxError(tokenStream, "Syntax error. action '%s' requires at least %d fixed parameter(s).", name, count)
			ok = false
		}
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != ")" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing FUNCTION; ')' expected.", token)
			ok = false
		}
	}
	if ( ok ) {
		// Parse the function name. {
		if ( !namedParams.target ) {
			// Auto-set the target if the function name starts with "Target".
			if ( strsub(lowername, 1, 6) == "target" ) {
				namedParams.target = "target"
				lowername = strsub(lowername, 7)
				name = strsub(name, 7)
			}
		}
		if ( !namedParams.filter ) {
			// Auto-set the aura filter if the function name starts with "Debuff" || "Buff".
			if ( strsub(lowername, 1, 6) == "debuff" ) {
				namedParams.filter = "debuff"
			} else if ( strsub(lowername, 1, 4) == "buff" ) {
				namedParams.filter = "buff"
			} else if ( strsub(lowername, 1, 11) == "otherdebuff" ) {
				namedParams.filter = "debuff"
			} else if ( strsub(lowername, 1, 9) == "otherbuff" ) {
				namedParams.filter = "buff"
			}
		}
		// Set the target if given in a prefix.
		if ( target ) {
			namedParams.target = target
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.name = name
		node.lowername = lowername
		if ( STATE_ACTION[lowername] ) {
			node.type = "state"
			// Built-in functions are case-insensitive.
			node.func = lowername
		} else if ( ACTION_PARAMETER_COUNT[lowername] ) {
			node.type = "action"
			// Built-in functions are case-insensitive.
			node.func = lowername
		} else if ( STRING_LOOKUP_FUNCTION[name] ) {
			node.type = "function"
			// String-lookup functions are case-sensitive.
			node.func = name
			annotation.stringReference = annotation.stringReference || {}
			tinsert(annotation.stringReference,  node)
		} else if ( OvaleCondition.IsCondition(lowername) ) {
			node.type = "function"
			// Built-in functions are case-insensitive.
			node.func = lowername
		} else {
			node.type = "custom_function"
			// Script-defined functions are case-sensitive.
			node.func = name
		}
		node.rawPositionalParams = positionalParams
		node.rawNamedParams = namedParams
		// Cache string representation.
		node.asString = UnparseFunction(node)
		annotation.parametersReference = annotation.parametersReference || {}
		tinsert(annotation.parametersReference,  node)
		annotation.functionCall = annotation.functionCall || {}
		annotation.functionCall[node.func] = true
		annotation.functionReference = annotation.functionReference || {}
		tinsert(annotation.functionReference,  node)
	}
	return ok, node
}

ParseGroup = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the left brace.
	{
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "{" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing GROUP; '{' expected.", token)
			ok = false
		}
	}
	// Consume any statements up to the matching right brace.
	var child = self_childrenPool.Get()
	var tokenType, token = tokenStream.Peek()
	while ( ok && tokenType && tokenType != "}" ) {
		var statementNode
		ok, statementNode = ParseStatement(tokenStream, nodeList, annotation)
		if ( ok ) {
			tinsert(child,  statementNode)
			tokenType, token = tokenStream.Peek()
		} else {
			break
		}
	}
	// Consume the right brace.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "}" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing GROUP; '}' expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "group"
		node.child = child
	} else {
		self_childrenPool.Release(child)
	}
	return ok, node
}

ParseIf = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the 'if' token.
	{
		var tokenType, token = tokenStream.Consume()
		if ( !(tokenType == "keyword" && token == "if") ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing IF; 'if' expected.", token)
			ok = false
		}
	}
	// Consume the condition && body.
	var conditionNode, bodyNode
	if ( ok ) {
		ok, conditionNode = ParseExpression(tokenStream, nodeList, annotation)
	}
	if ( ok ) {
		ok, bodyNode = ParseStatement(tokenStream, nodeList, annotation)
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList, true)
		node.type = "if"
		node.child[1] = conditionNode
		node.child[2] = bodyNode
	}
	return ok, node
}

ParseInclude = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the 'Include' token.
	{
		var tokenType, token = tokenStream.Consume()
		if ( !(tokenType == "keyword" && token == "Include") ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing INCLUDE; 'Include' expected.", token)
			ok = false
		}
	}
	// Consume the left parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "(" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing INCLUDE; '(' expected.", token)
			ok = false
		}
	}
	// Consume the script name.
	var name
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "name" ) {
			name = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing INCLUDE; script name expected.", token)
			ok = false
		}
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != ")" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing INCLUDE; ')' expected.", token)
			ok = false
		}
	}
	// Get the code associated with the script name.
	var code = OvaleScripts.GetScript(name)
	if ( !code ) {
		OvaleAST.Error("Script '%s' !found when parsing INCLUDE.", name)
		ok = false
	}
	// Create the AST node.
	var node
	if ( ok ) {
		var includeTokenStream = OvaleLexer(name, GetTokenIterator(code))
		ok, node = ParseScript(includeTokenStream, nodeList, annotation)
		includeTokenStream.Release()
	}
	return ok, node
}

ParseItemInfo = function(tokenStream, nodeList, annotation) {
	var ok = true
	var name, lowername
	// Consume the 'ItemInfo' token.
	{
		var tokenType, token = tokenStream.Consume()
		if ( !(tokenType == "keyword" && token == "ItemInfo") ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ITEMINFO; 'ItemInfo' expected.", token)
			ok = false
		}
	}
	// Consume the left parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "(" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ITEMINFO; '(' expected.", token)
			ok = false
		}
	}
	// Consume the item ID.
	var itemId, name
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "number" ) {
			itemId = token
		} else if ( tokenType == "name" ) {
			name = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ITEMINFO; number || name expected.", token)
			ok = false
		}
	}
	// Consume any ItemInfo parameters.
	var positionalParams, namedParams
	if ( ok ) {
		ok, positionalParams, namedParams = ParseParameters(tokenStream, nodeList, annotation)
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != ")" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing ITEMINFO; ')' expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "item_info"
		node.itemId = itemId
		node.name = name
		node.rawPositionalParams = positionalParams
		node.rawNamedParams = namedParams
		annotation.parametersReference = annotation.parametersReference || {}
		tinsert(annotation.parametersReference,  node)
		if ( name ) {
			annotation.nameReference = annotation.nameReference || {}
			tinsert(annotation.nameReference,  node)
		}
	}
	return ok, node
}

ParseList = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the list token.
	var keyword
	{
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "keyword" && (token == "ItemList" || token == "SpellList") ) {
			keyword = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing LIST; keyword expected.", token)
			ok = false
		}
	}
	// Consume the left parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "(" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing LIST; '(' expected.", token)
			ok = false
		}
	}
	// Consume the list name.
	var name
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "name" ) {
			name = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing LIST; name expected.", token)
			ok = false
		}
	}
	// Consume the list.
	var positionalParams, namedParams
	if ( ok ) {
		ok, positionalParams, namedParams = ParseParameters(tokenStream, nodeList, annotation)
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != ")" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing LIST; ')' expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "list"
		node.keyword = keyword
		node.name = name
		node.rawPositionalParams = positionalParams
		node.rawNamedParams = namedParams
		annotation.parametersReference = annotation.parametersReference || {}
		tinsert(annotation.parametersReference,  node)
	}
	return ok, node
}

ParseNumber = function(tokenStream, nodeList, annotation) {
	var ok = true
	var value
	// Consume the number.
	{
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "number" ) {
			value = tonumber(token)
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing NUMBER; number expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = GetNumberNode(value, nodeList, annotation)
	}
	return ok, node
}

ParseParameterValue = function(tokenStream, nodeList, annotation) {
	var ok = true
	var node
	var tokenType, token
	var parameters
	do {
		ok, node = ParseSimpleParameterValue(tokenStream, nodeList, annotation)
		if ( ok && node ) {
			tokenType, token = tokenStream.Peek()
			if ( tokenType == "," ) {
				// Consume the ',' token.
				tokenStream.Consume()
				parameters = parameters || self_parametersPool.Get()
			}
			if ( parameters ) {
				tinsert(parameters,  node)
			}
		}
	} while (!( !ok || tokenType != ","))
	if ( ok && parameters ) {
		// This was a list of comma-separated values.
		node = OvaleAST.NewNode(nodeList)
		node.type = "comma_separated_values"
		node.csv = parameters
		annotation.parametersList = annotation.parametersList || {}
		tinsert(annotation.parametersList,  parameters)
	}
	return ok, node
}

ParseParameters = function(tokenStream, nodeList, annotation, isList) {
	var ok = true
	var positionalParams = self_parametersPool.Get()
	var namedParams = self_parametersPool.Get()
	while ( ok ) {
		var tokenType, token = tokenStream.Peek()
		if ( tokenType ) {
			var name, node
			if ( tokenType == "name" ) {
				ok, node = ParseVariable(tokenStream, nodeList, annotation)
				if ( ok ) {
					name = node.name
				}
			} else if ( tokenType == "number" ) {
				ok, node = ParseNumber(tokenStream, nodeList, annotation)
				if ( ok ) {
					name = node.value
				}
			} else if ( tokenType == "-" ) {
				// This should be a negative number.
				// Consume the '-' token.
				tokenStream.Consume()
				ok, node = ParseNumber(tokenStream, nodeList, annotation)
				if ( ok ) {
					// Elide the unary negation operator into the number.
					var value = -1 * node.value
					node = GetNumberNode(value, nodeList, annotation)
					name = value
				}
			} else if ( tokenType == "string" ) {
				ok, node = ParseString(tokenStream, nodeList, annotation)
				if ( ok ) {
					name = node.value
				}
			} else if ( PARAMETER_KEYWORD[token] ) {
				if ( isList ) {
					SyntaxError(tokenStream, "Syntax error. unexpected keyword '%s' when parsing PARAMETERS; simple expression expected.", token)
					ok = false
				} else {
					tokenStream.Consume()
					name = token
				}
			} else {
				break
			}
			// Check if this is a bare value || the start of a "name=value" pair.
			if ( ok && name ) {
				tokenType, token = tokenStream.Peek()
				if ( tokenType == "=" ) {
					// Consume the '=' token.
					tokenStream.Consume()
					if ( name == "checkbox" || name == "listitem" ) {
						var control = namedParams[name] || self_controlPool.Get()
						if ( name == "checkbox" ) {
							// Get the checkbox name.
							ok, node = ParseSimpleParameterValue(tokenStream, nodeList, annotation)
							if ( ok && node ) {
								// Check afterwards that the parameter value is only "name" || "!name".
								if ( !(node.type == "variable" || (node.type == "bang_value" && node.child[1].type == "variable")) ) {
									SyntaxError(tokenStream, "Syntax error. 'checkbox' parameter with unexpected value '%s'.", Unparse(node))
									ok = false
								}
							}
							if ( ok ) {
								tinsert(control,  node)
							}
						} else { // if ( name == "listitem" ) {
							// Consume the list name.
							tokenType, token = tokenStream.Consume()
							var list
							if ( tokenType == "name" ) {
								list = token
							} else {
								SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing PARAMETERS; name expected.", token)
								ok = false
							}
							if ( ok ) {
								// Consume the '.' token.
								tokenType, token = tokenStream.Consume()
								if ( tokenType != "." ) {
									SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing PARAMETERS; '.' expected.", token)
									ok = false
								}
							}
							if ( ok ) {
								// Consume the list item.
								ok, node = ParseSimpleParameterValue(tokenStream, nodeList, annotation)
							}
							if ( ok && node ) {
								// Check afterwards that the parameter value is only "name" || "!name".
								if ( !(node.type == "variable" || (node.type == "bang_value" && node.child[1].type == "variable")) ) {
									SyntaxError(tokenStream, "Syntax error. 'listitem=%s' parameter with unexpected value '%s'.", Unparse(node))
									ok = false
								}
							}
							if ( ok ) {
								control[list] = node
							}
						}
						if ( !namedParams[name] ) {
							namedParams[name] = control
							annotation.controlList = annotation.controlList || {}
							tinsert(annotation.controlList,  control)
						}
					} else {
						// Get the value.
						ok, node = ParseParameterValue(tokenStream, nodeList, annotation)
						namedParams[name] = node
					}
				} else {
					tinsert(positionalParams,  node)
				}
			}
		} else {
			break
		}
	}
	if ( ok ) {
		annotation.parametersList = annotation.parametersList || {}
		tinsert(annotation.parametersList,  positionalParams)
		tinsert(annotation.parametersList,  namedParams)
	} else {
		positionalParams = null
		namedParams = null
	}
	return ok, positionalParams, namedParams
}

ParseParentheses = function(tokenStream, nodeList, annotation) {
	var ok = true
	var leftToken, rightToken
	// Consume the left parenthesis.
	{
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "(" ) {
			leftToken, rightToken = "(", ")"
		} else if ( tokenType == "{" ) {
			leftToken, rightToken = "{", "}"
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing PARENTHESES; '(' || '{' expected.", token)
			ok = false
		}
	}
	// Consume the inner expression.
	var node
	if ( ok ) {
		ok, node = ParseExpression(tokenStream, nodeList, annotation)
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != rightToken ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing PARENTHESES; '%s' expected.", token, rightToken)
			ok = false
		}
	}
	// Create the AST node.
	if ( ok ) {
		node.left = leftToken
		node.right = rightToken
	}
	return ok, node
}

ParseScoreSpells = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the 'ScoreSpells' token.
	{
		var tokenType, token = tokenStream.Consume()
		if ( !(tokenType == "keyword" && token == "ScoreSpells") ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SCORESPELLS; 'ScoreSpells' expected.", token)
			ok = false
		}
	}
	// Consume the left parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "(" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SCORESPELLS; '(' expected.", token)
			ok = false
		}
	}
	// Consume the list of spells.
	var positionalParams, namedParams
	if ( ok ) {
		ok, positionalParams, namedParams = ParseParameters(tokenStream, nodeList, annotation)
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != ")" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SCORESPELLS; ')' expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "score_spells"
		node.rawPositionalParams = positionalParams
		node.rawNamedParams = namedParams
		annotation.parametersReference = annotation.parametersReference || {}
		tinsert(annotation.parametersReference,  node)
	}
	return ok, node
}

ParseScript = function(tokenStream, nodeList, annotation) {
	OvaleAST.StartProfiling("OvaleAST_ParseScript")
	var ok = true
	// Consume each declaration.
	var child = self_childrenPool.Get()
	while ( ok ) {
		var tokenType, token = tokenStream.Peek()
		if ( tokenType ) {
			var declarationNode
			ok, declarationNode = ParseDeclaration(tokenStream, nodeList, annotation)
			if ( ok ) {
				if ( declarationNode.type == "script" ) {
					for ( _, node in ipairs(declarationNode.child) ) {
						tinsert(child,  node)
					}
					// All "script" nodes are standalone && need to be explicitly released.
					self_pool.Release(declarationNode)
				} else {
					tinsert(child,  declarationNode)
				}
			}
		} else {
			break
		}
	}
	// Create the AST node.
	var ast
	if ( ok ) {
		// Create a standalone AST node.
		ast = OvaleAST.NewNode()
		ast.type = "script"
		ast.child = child
	} else {
		self_childrenPool.Release(child)
	}
	OvaleAST.StopProfiling("OvaleAST_ParseScript")
	return ok, ast
}

ParseSimpleExpression = function(tokenStream, nodeList, annotation) {
	var ok = true
	var node
	var tokenType, token = tokenStream.Peek()
	if ( tokenType == "number" ) {
		ok, node = ParseNumber(tokenStream, nodeList, annotation)
	} else if ( tokenType == "string" ) {
		ok, node = ParseString(tokenStream, nodeList, annotation)
	} else if ( tokenType == "name" ) {
		tokenType, token = tokenStream.Peek(2)
		if ( tokenType == "." || tokenType == "(" ) {
			ok, node = ParseFunction(tokenStream, nodeList, annotation)
		} else {
			ok, node = ParseVariable(tokenStream, nodeList, annotation)
		}
	} else if ( tokenType == "(" || tokenType == "{" ) {
		ok, node = ParseParentheses(tokenStream, nodeList, annotation)
	} else {
		tokenStream.Consume()
		SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SIMPLE EXPRESSION", token)
		ok = false
	}
	return ok, node
}

ParseSimpleParameterValue = function(tokenStream, nodeList, annotation) {
	var ok = true
	var isBang = false
	var tokenType, token = tokenStream.Peek()
	if ( tokenType == "!" ) {
		isBang = true
		// Consume the '!' token.
		tokenStream.Consume()
	}
	var expressionNode
	tokenType, token = tokenStream.Peek()
	if ( tokenType == "(" || tokenType == "-" ) {
		ok, expressionNode = ParseExpression(tokenStream, nodeList, annotation)
	} else {
		ok, expressionNode = ParseSimpleExpression(tokenStream, nodeList, annotation)
	}
	var node
	if ( isBang ) {
		node = OvaleAST.NewNode(nodeList, true)
		node.type = "bang_value"
		node.child[1] = expressionNode
	} else {
		node = expressionNode
	}
	return ok, node
}

ParseSpellAuraList = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the keyword token.
	var keyword
	{
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "keyword" && SPELL_AURA_KEYWORD[token] ) {
			keyword = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLAURALIST; keyword expected.", token)
			ok = false
		}
	}
	// Consume the left parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "(" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLAURALIST; '(' expected.", token)
			ok = false
		}
	}
	// Consume the spell ID.
	var spellId, name
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "number" ) {
			spellId = token
		} else if ( tokenType == "name" ) {
			name = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLAURALIST; number || name expected.", token)
			ok = false
		}
	}
	
	// Consume any parameters.
	var positionalParams, namedParams
	if ( ok ) {
		ok, positionalParams, namedParams = ParseParameters(tokenStream, nodeList, annotation)
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != ")" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLAURALIST; ')' expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "spell_aura_list"
		node.keyword = keyword
		node.spellId = spellId
		node.name = name
		node.rawPositionalParams = positionalParams
		node.rawNamedParams = namedParams
		annotation.parametersReference = annotation.parametersReference || {}
		tinsert(annotation.parametersReference,  node)
		if ( name ) {
			annotation.nameReference = annotation.nameReference || {}
			tinsert(annotation.nameReference,  node)
		}
	}
	return ok, node
}

ParseSpellInfo = function(tokenStream, nodeList, annotation) {
	var ok = true
	var name, lowername
	// Consume the 'SpellInfo' token.
	{
		var tokenType, token = tokenStream.Consume()
		if ( !(tokenType == "keyword" && token == "SpellInfo") ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLINFO; 'SpellInfo' expected.", token)
			ok = false
		}
	}
	// Consume the left parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "(" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLINFO; '(' expected.", token)
			ok = false
		}
	}
	// Consume the spell ID.
	var spellId, name
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "number" ) {
			spellId = token
		} else if ( tokenType == "name" ) {
			name = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLINFO; number || name expected.", token)
			ok = false
		}
	}
	// Consume any SpellInfo parameters.
	var positionalParams, namedParams
	if ( ok ) {
		ok, positionalParams, namedParams = ParseParameters(tokenStream, nodeList, annotation)
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != ")" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLINFO; ')' expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "spell_info"
		node.spellId = spellId
		node.name = name
		node.rawPositionalParams = positionalParams
		node.rawNamedParams = namedParams
		annotation.parametersReference = annotation.parametersReference || {}
		tinsert(annotation.parametersReference,  node)
		if ( name ) {
			annotation.nameReference = annotation.nameReference || {}
			tinsert(annotation.nameReference,  node)
		}
	}
	return ok, node
}

ParseSpellRequire = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the keyword token.
	{
		var tokenType, token = tokenStream.Consume()
		if ( !(tokenType == "keyword" && token == "SpellRequire") ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLREQUIRE; keyword expected.", token)
			ok = false
		}
	}
	// Consume the left parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != "(" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLREQUIRE; '(' expected.", token)
			ok = false
		}
	}
	// Consume the spell ID.
	var spellId, name
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "number" ) {
			spellId = token
		} else if ( tokenType == "name" ) {
			name = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLREQUIRE; number || name expected.", token)
			ok = false
		}
	}
	// Consume the property name.
	var property
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "name" ) {
			property = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLREQUIRE; property name expected.", token)
			ok = false
		}
	}
	// Consume any parameters.
	var positionalParams, namedParams
	if ( ok ) {
		ok, positionalParams, namedParams = ParseParameters(tokenStream, nodeList, annotation)
	}
	// Consume the right parenthesis.
	if ( ok ) {
		var tokenType, token = tokenStream.Consume()
		if ( tokenType != ")" ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing SPELLREQUIRE; ')' expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "spell_require"
		node.spellId = spellId
		node.name = name
		node.property = property
		node.rawPositionalParams = positionalParams
		node.rawNamedParams = namedParams
		annotation.parametersReference = annotation.parametersReference || {}
		tinsert(annotation.parametersReference,  node)
		if ( name ) {
			annotation.nameReference = annotation.nameReference || {}
			tinsert(annotation.nameReference,  node)
		}
	}
	return ok, node
}

ParseStatement = function(tokenStream, nodeList, annotation) {
	var ok = true
	var node
	var tokenType, token = tokenStream.Peek()
	if ( tokenType ) {
		var parser
		if ( token == "{" ) {
			// Find the matching '}' && inspect the next token to see if this is an expression || a group.
			var i = 1
			var count = 0
			while ( tokenType ) {
				if ( token == "{" ) {
					count = count + 1
				} else if ( token == "}" ) {
					count = count - 1
				}
				i = i + 1
				tokenType, token = tokenStream.Peek(i)
				if ( count == 0 ) {
					break
				}
			}
			if ( tokenType ) {
				if ( BINARY_OPERATOR[token] ) {
					ok, node = ParseExpression(tokenStream, nodeList, annotation)
				} else {
					ok, node = ParseGroup(tokenStream, nodeList, annotation)
				}
			} else {
				SyntaxError(tokenStream, "Syntax error. unexpected } of script.")
			}
		} else if ( token == "if" ) {
			ok, node = ParseIf(tokenStream, nodeList, annotation)
		} else if ( token == "unless" ) {
			ok, node = ParseUnless(tokenStream, nodeList, annotation)
		} else {
			ok, node = ParseExpression(tokenStream, nodeList, annotation)
		}
	}
	return ok, node
}

ParseString = function(tokenStream, nodeList, annotation) {
	var ok = true
	var node
	var value
	if ( ok ) {
		var tokenType, token = tokenStream.Peek()
		if ( tokenType == "string" ) {
			value = token
			tokenStream.Consume()
		} else if ( tokenType == "name" ) {
			if ( STRING_LOOKUP_FUNCTION[token] ) {
				ok, node = ParseFunction(tokenStream, nodeList, annotation)
			} else {
				value = token
				tokenStream.Consume()
			}
		} else {
			tokenStream.Consume()
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing STRING; string, variable, || function expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	if ( ok && !node ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "string"
		node.value = value
		annotation.stringReference = annotation.stringReference || {}
		tinsert(annotation.stringReference,  node)
	}
	return ok, node
}

ParseUnless = function(tokenStream, nodeList, annotation) {
	var ok = true
	// Consume the 'unless' token.
	{
		var tokenType, token = tokenStream.Consume()
		if ( !(tokenType == "keyword" && token == "unless") ) {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing UNLESS; 'unless' expected.", token)
			ok = false
		}
	}
	// Consume the condition && body.
	var conditionNode, bodyNode
	if ( ok ) {
		ok, conditionNode = ParseExpression(tokenStream, nodeList, annotation)
	}
	if ( ok ) {
		ok, bodyNode = ParseStatement(tokenStream, nodeList, annotation)
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList, true)
		node.type = "unless"
		node.child[1] = conditionNode
		node.child[2] = bodyNode
	}
	return ok, node
}

ParseVariable = function(tokenStream, nodeList, annotation) {
	var ok = true
	var name
	// Consume the variable name.
	{
		var tokenType, token = tokenStream.Consume()
		if ( tokenType == "name" ) {
			name = token
		} else {
			SyntaxError(tokenStream, "Syntax error. unexpected token '%s' when parsing VARIABLE; name expected.", token)
			ok = false
		}
	}
	// Create the AST node.
	var node
	if ( ok ) {
		node = OvaleAST.NewNode(nodeList)
		node.type = "variable"
		node.name = name
		annotation.nameReference = annotation.nameReference || {}
		tinsert(annotation.nameReference,  node)
	}
	return ok, node
}

{
	PARSE_VISITOR = {
		["action"] : ParseFunction,
		["add_function"] : ParseAddFunction,
		["arithmetic"] : ParseExpression,
		["bang_value"] : ParseSimpleParameterValue,
		["checkbox"] : ParseAddCheckBox,
		["compare"] : ParseExpression,
		["comment"] : ParseComment,
		["custom_function"] : ParseFunction,
		["define"] : ParseDefine,
		["expression"] : ParseExpression,
		["function"] : ParseFunction,
		["group"] : ParseGroup,
		["icon"] : ParseAddIcon,
		["if"] : ParseIf,
		["item_info"] : ParseItemInfo,
		["list"] : ParseList,
		["list_item"] : ParseAddListItem,
		["logical"] : ParseExpression,
		["score_spells"] : ParseScoreSpells,
		["script"] : ParseScript,
		["spell_aura_list"] : ParseSpellAuraList,
		["spell_info"] : ParseSpellInfo,
		["spell_require"] : ParseSpellRequire,
		["string"] : ParseString,
		["unless"] : ParseUnless,
		["value"] : ParseNumber,
		["variable"] : ParseVariable,
	}
}
//</private-static-methods>

//<public-static-methods>

class OvaleAST implements ProfiledModule {
	// Export list of parameters keywords.
	PARAMETER_KEYWORD = PARAMETER_KEYWORD
	//</public-static-properties>

	OnInitialize() {
		// Resolve module dependencies.
		OvaleCondition = ovale.OvaleCondition
		OvaleLexer = ovale.OvaleLexer
		OvaleScripts = ovale.OvaleScripts
		OvaleSpellBook = ovale.OvaleSpellBook
		OvaleStance = ovale.OvaleStance
	}

	DebugAST() {
		self_pool.DebuggingInfo()
		self_parametersPool.DebuggingInfo()
		self_controlPool.DebuggingInfo()
		self_childrenPool.DebuggingInfo()
		self_outputPool.DebuggingInfo()
	}


	NodeToString(node) {
		var output = print_r(node)
		return tconcat(output, "\n")
	}

	ReleaseAnnotation(annotation) {
		if ( annotation.controlList ) {
			for ( _, control in ipairs(annotation.controlList) ) {
				self_controlPool.Release(control)
			}
		}
		if ( annotation.parametersList ) {
			for ( _, parameters in ipairs(annotation.parametersList) ) {
				self_parametersPool.Release(parameters)
			}
		}
		if ( annotation.nodeList ) {
			for ( _, node in ipairs(annotation.nodeList) ) {
				self_pool.Release(node)
			}
		}
		for ( key, value in pairs(annotation) ) {
			if ( type(value) == "table" ) {
				wipe(value)
			}
			annotation[key] = null
		}
	}

	Release(ast) {
		if ( ast.annotation ) {
			this.ReleaseAnnotation(ast.annotation)
			ast.annotation = null
		}
		self_pool.Release(ast)
	}

	ParseCode(nodeType, code, nodeList, annotation) {
		nodeList = nodeList || {}
		annotation = annotation || {}
		var tokenStream = OvaleLexer("Ovale", GetTokenIterator(code))
		var ok, node = Parse(nodeType, tokenStream, nodeList, annotation)
		tokenStream.Release()
		return node, nodeList, annotation
	}

	ParseScript(name, options) {
		// Get the code associated with the script name.
		var code = OvaleScripts.GetScript(name)
		var ast
		if ( code ) {
			options = options || { optimize = true, verify = true }
			// Annotation table for the AST.
			var annotation = {
				nodeList : {},
				verify = options.verify,
			}
			ast = this.ParseCode("script", code, annotation.nodeList, annotation)
			if ( ast ) {
				ast.annotation = annotation
				this.PropagateConstants(ast)
				this.PropagateStrings(ast)
				this.FlattenParameters(ast)
				this.VerifyParameterStances(ast)
				this.VerifyFunctionCalls(ast)
				if ( options.optimize ) {
					this.Optimize(ast)
				}
				this.InsertPostOrderTraversal(ast)
			} else {
				// Create a dummy node to properly release resources.
				ast = this.NewNode()
				ast.annotation = annotation
				this.Release(ast)
				ast = null
			}
		}
		return ast
	}

	Unparse(node) {
		return Unparse(node)
	}

	// Replaces variables with their defined values.
	PropagateConstants(ast:Ast) {
		this.StartProfiling("OvaleAST_PropagateConstants")
		if ( ast.annotation ) {
			var dictionary = ast.annotation.definition
			if ( dictionary && ast.annotation.nameReference ) {
				for (let key in ast.annotation.nameReference) {
					let node = ast.annotation.nameReference[key];
					if ( node.type == "item_info" && node.name ) {
						var itemId = dictionary[node.name]
						if ( itemId ) {
							node.itemId = itemId
						}
					} else if ( (node.type == "spell_aura_list" || node.type == "spell_info" || node.type == "spell_require") && node.name ) {
						var spellId = dictionary[node.name]
						if ( spellId ) {
							node.spellId = spellId
						}
					} else if ( node.type == "variable" ) {
						var name = node.name
						var value = dictionary[name]
						if ( value ) {
							// Convert to a value node.
							node.previousType = "variable"
							node.type = "value"
							node.value = value
							node.origin = 0
							node.rate = 0
						}
					}
				}
			}
		}
		this.StopProfiling("OvaleAST_PropagateConstants")
	}

	// Replaces variables && string-lookup function calls with string values. {
	PropagateStrings(ast) {
		this.StartProfiling("OvaleAST_PropagateStrings")
		if ( ast.annotation && ast.annotation.stringReference ) {
			for ( _, node in ipairs(ast.annotation.stringReference) ) {
				if ( node.type == "string" ) {
					var key = node.value
					var value = L[key]
					if ( key != value ) {
						node.value = value
						node.key = key
					}
				} else if ( node.type == "variable" ) {
					var value = node.name
					// Convert to a string node.
					node.previousType = node.type
					node.type = "string"
					node.value = value
				} else if ( node.type == "number" ) {
					var value = tostring(node.value)
					// Convert to a string node.
					node.previousType = "number"
					node.type = "string"
					node.value = value
				} else if ( node.type == "function" ) {
					// Get the lookup key for the string database.
					var key = node.rawPositionalParams[1]
					if ( type(key) == "table" ) {
						if ( key.type == "value" ) {
							key = key.value
						} else if ( key.type == "variable" ) {
							key = key.name
						} else if ( key.type == "string" ) {
							key = key.value
						}
					}
					var value
					if ( key ) {
						var name = node.name
						if ( name == "ItemName" ) {
							value = API_GetItemInfo(key) || "item." + key
						} else if ( name == "L" ) {
							value = L[key]
						} else if ( name == "SpellName" ) {
							value = OvaleSpellBook.GetSpellName(key) || "spell." + key
						}
					}
					if ( value ) {
						// Convert to a string node.
						node.previousType = "function"
						node.type = "string"
						node.value = value
						node.key = key
					}
				}
			}
		}
		this.StopProfiling("OvaleAST_PropagateStrings")
	}

	// "Flattens" parameter tables by replacing table values with the bare numerical || string values
	// so that the parameter table can be used directly by script conditions.
	FlattenParameters(ast) {
		this.StartProfiling("OvaleAST_FlattenParameters")
		var annotation = ast.annotation
		if ( annotation && annotation.parametersReference ) {
			var dictionary = annotation.definition
			for ( _, node in ipairs(annotation.parametersReference) ) {
				if ( node.rawPositionalParams ) {
					var parameters = self_parametersPool.Get()
					for ( key, value in ipairs(node.rawPositionalParams) ) {
						parameters[key] = FlattenParameterValue(value, annotation)
					}
					node.positionalParams = parameters
					annotation.parametersList = annotation.parametersList || {}
					tinsert(annotation.parametersList,  parameters)
				}
				if ( node.rawNamedParams ) {
					var parameters = self_parametersPool.Get()
					for ( key, value in pairs(node.rawNamedParams) ) {
						// Lookup the key.
						if ( key == "checkbox" || key == "listitem" ) {
							var control = parameters[key] || self_controlPool.Get()
							if ( key == "checkbox" ) {
								for ( i, name in ipairs(value) ) {
									control[i] = FlattenParameterValue(name, annotation)
								}
							} else { // if ( key == "listitem" ) {
								for ( list, item in pairs(value) ) {
									control[list] = FlattenParameterValue(item, annotation)
								}
							}
							if ( !parameters[key] ) {
								parameters[key] = control
								annotation.controlList = annotation.controlList || {}
								tinsert(annotation.controlList,  control)
							}
						} else {
							if ( type(key) != "number" && dictionary && dictionary[key] ) {
								key = dictionary[key]
							}
							parameters[key] = FlattenParameterValue(value, annotation)
						}
					}
					node.namedParams = parameters
					annotation.parametersList = annotation.parametersList || {}
					tinsert(annotation.parametersList,  parameters)
				}
				// Save a flattened string representation of the parameters.
				var output = self_outputPool.Get()
				for ( k, v in pairs(node.namedParams) ) {
					if ( k == "checkbox" ) {
						for ( _, name in ipairs(v) ) {
							tinsert(output,  format("checkbox=%s", name))
						}
					} else if ( k == "listitem" ) {
						for ( list, item in ipairs(v) ) {
							tinsert(output,  format("listitem=%s.%s", list, item))
						}
					} else if ( type(v) == "table" ) {
						// Comma-separated value.
						tinsert(output,  format("%s=%s", k, tconcat(v, ",")))
					} else {
						tinsert(output,  format("%s=%s", k, v))
					}
				}
				tsort(output)
				for (let k = tlen(node.positionalParams); k >= 1; k = k -1 ) {
					tinsert(output, 1, node.positionalParams[k])
				}
				if ( tlen(output) > 0 ) {
					node.paramsAsString = tconcat(output, " ")
				} else {
					node.paramsAsString = ""
				}
				self_outputPool.Release(output)
			}
		}
		this.StopProfiling("OvaleAST_FlattenParameters")
	}

	// Verify that all functions called within the script are known.
	VerifyFunctionCalls(ast) {
		this.StartProfiling("OvaleAST_VerifyFunctionCalls")
		if ( ast.annotation && ast.annotation.verify ) {
			var customFunction = ast.annotation.customFunction
			var functionCall = ast.annotation.functionCall
			if ( functionCall ) {
				for ( name in pairs(functionCall) ) {
					if ( ACTION_PARAMETER_COUNT[name] ) {
						// Function call is an action.
					} else if ( STRING_LOOKUP_FUNCTION[name] ) {
						// Function call is a string-lookup function. {
					} else if ( OvaleCondition.IsCondition(name) ) {
						// Function call is a registered script condition.
					} else if ( customFunction && customFunction[name] ) {
						// Function call is a script-defined function (via AddFunction). {
					} else {
						this.Error("unknown function '%s'.", name)
					}
				}
			}
		}
		this.StopProfiling("OvaleAST_VerifyFunctionCalls")
	}

	VerifyParameterStances(ast) {
		this.StartProfiling("OvaleAST_VerifyParameterStances")
		var annotation = ast.annotation
		if ( annotation && annotation.verify && annotation.parametersReference ) {
			for ( _, node in ipairs(annotation.parametersReference) ) {
				if ( node.rawNamedParams ) {
					for ( stanceKeyword in pairs(STANCE_KEYWORD) ) {
						var valueNode = node.rawNamedParams[stanceKeyword]
						if ( valueNode ) {
							if ( valueNode.type == "comma_separated_values" ) {
								valueNode = valueNode.csv[1]
							}
							if ( valueNode.type == "bang_value" ) {
								valueNode = valueNode.child[1]
							}
							var value = FlattenParameterValue(valueNode, annotation)
							if ( OvaleStance.STANCE_NAME[value] ) {
								// The value is a valid stance name.
							} else if ( type(value) == "number" ) {
								// The value is a number, which is a valid stance reference.
							} else {
								this.Error("unknown stance '%s'.", value)
							}
						}
					}
				}
			}
		}
		this.StopProfiling("OvaleAST_VerifyParameterStances")
	}

	// Insert a "postOrder" property into top-level nodes.
	InsertPostOrderTraversal(ast) {
		this.StartProfiling("OvaleAST_InsertPostOrderTraversal")
		var annotation = ast.annotation
		if ( annotation && annotation.postOrderReference ) {
			for ( _, node in ipairs(annotation.postOrderReference) ) {
				var array = self_postOrderPool.Get()
				var visited = self_postOrderPool.Get()
				PostOrderTraversal(node, array, visited)
				self_postOrderPool.Release(visited)
				node.postOrder = array
				/*
				var postOrder = node.postOrder
				var output = self_outputPool.Get()
				var i = 1
				while ( postOrder[i] ) {
					var child, parent = postOrder[i], postOrder[i + 1]
					tinsert(output,  child.nodeId)
					i = i + 2
				}
				var outputHeader = format("Post-order for %d has %d nodes. ", node.nodeId, (i - 1) / 2)
				var outputString = outputHeader + tconcat(output, ", ")
				self_outputPool.Release(output)
				this.Print(outputString)
				//*/
			}
		}
		this.StopProfiling("OvaleAST_InsertPostOrderTraversal")
	}

	Optimize(ast) {
		this.CommonFunctionElimination(ast)
		this.CommonSubExpressionElimination(ast)
	}

	/*////////////////////////////////////////////////////////////////////////////
		Common Function Elimination

		This is an optimizing transformation of the AST that globally replaces
		references to function nodes to the node of the first function call made {
		with identical parameters.
	//*/
	CommonFunctionElimination(ast) {
		this.StartProfiling("OvaleAST_CommonFunctionElimination")
		if ( ast.annotation ) {
			// Hash all of the function calls. {
			if ( ast.annotation.functionReference ) {
				var functionHash = ast.annotation.functionHash || {}
				for ( _, node in ipairs(ast.annotation.functionReference) ) {
					if ( node.positionalParams || node.namedParams ) {
						var hash = node.name + "(" + node.paramsAsString + ")"
						node.functionHash = hash
						functionHash[hash] = functionHash[hash] || node
					}
				}
				ast.annotation.functionHash = functionHash
			}

			// Walk the AST && search for child nodes that are function nodes && {
			// replace with a reference to the hashed node.
			if ( ast.annotation.functionHash && ast.annotation.nodeList ) {
				var functionHash = ast.annotation.functionHash
				for ( _, node in ipairs(ast.annotation.nodeList) ) {
					if ( node.child ) {
						for ( k, childNode in ipairs(node.child) ) {
							if ( childNode.functionHash ) {
								node.child[k] = functionHash[childNode.functionHash]
							}
						}
					}
				}
			}
		}
		this.StopProfiling("OvaleAST_CommonFunctionElimination")
	}

	/*////////////////////////////////////////////////////////////////////////////
		Common Sub-Expression Elimination

		This is an optimizing transformation of the AST that globally replaces
		references to nodes with a string representation with the first node found
		that has the same string representation.
	//*/

	CommonSubExpressionElimination(ast) {
		this.StartProfiling("OvaleAST_CommonSubExpressionElimination")
		if ( ast && ast.annotation && ast.annotation.nodeList ) {
			var expressionHash = {}
			// Walk the AST && search for child nodes that have string representations.
			for ( _, node in ipairs(ast.annotation.nodeList) ) {
				var hash = node.asString
				// Hash the node if it has a string representation.
				if ( hash ) {
					expressionHash[hash] = expressionHash[hash] || node
				}
				// Replace all child nodes with hashed nodes if they exist.
				if ( node.child ) {
					for ( i, childNode in ipairs(node.child) ) {
						hash = childNode.asString
						if ( hash ) {
							var hashNode = expressionHash[hash]
							if ( hashNode ) {
								// Replace the child node with a previous hashed node if it exists.
								node.child[i] = hashNode
							} else {
								// Hash the child node if it has a string representation.
								expressionHash[hash] = childNode
							}
						}
					}
				}
			}
			ast.annotation.expressionHash = expressionHash
		}
		this.StopProfiling("OvaleAST_CommonSubExpressionElimination")
	}
}

export var ovaleAST = ovale.NewModule("OvaleAST", new OvaleAST());
// Register for profiling.
ovaleProfiler.RegisterProfiling(ovaleAST);
