"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TSResolverGenerator = void 0;
var utils_1 = require("./utils");
var TSResolverGenerator = /** @class */ (function () {
    function TSResolverGenerator(options, introspectionResult) {
        var _a;
        this.options = options;
        this.introspectionResult = introspectionResult;
        this.importHeader = [];
        this.resolverInterfaces = [];
        this.resolverObject = [];
        this.resolverResult = {};
        this.contextType = options.contextType || 'any';
        if (options.importStatements) {
            (_a = this.importHeader).push.apply(_a, options.importStatements);
        }
    }
    TSResolverGenerator.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var introspectionResult, gqlTypes, hasCustomScalar;
            var _this = this;
            return __generator(this, function (_a) {
                introspectionResult = this.introspectionResult;
                gqlTypes = introspectionResult.__schema.types.filter(function (type) { return !(0, utils_1.isBuiltinType)(type); });
                this.queryType = introspectionResult.__schema.queryType;
                this.mutationType = introspectionResult.__schema.mutationType;
                this.subscriptionType = introspectionResult.__schema.subscriptionType;
                this.importHeader.push('/* tslint:disable */');
                this.importHeader.push('/* eslint-disable */');
                hasCustomScalar = !!gqlTypes.find(function (type) { return type.kind === 'SCALAR'; });
                if (hasCustomScalar) {
                    this.importHeader.push("import { GraphQLResolveInfo, GraphQLScalarType } from 'graphql';");
                }
                else {
                    this.importHeader.push("import { GraphQLResolveInfo } from 'graphql';");
                }
                this.resolverObject = [
                    '/**',
                    ' * This interface define the shape of your resolver',
                    ' * Note that this type is designed to be compatible with graphql-tools resolvers',
                    ' * However, you can still use other generated interfaces to make your resolver type-safed',
                    ' */',
                    "export interface ".concat(this.options.typePrefix, "Resolver {")
                ];
                gqlTypes.forEach(function (type) {
                    var isSubscription = introspectionResult.__schema.subscriptionType ?
                        introspectionResult.__schema.subscriptionType.name === type.name
                        : false;
                    switch (type.kind) {
                        case 'SCALAR': {
                            _this.generateCustomScalarResolver(type);
                            break;
                        }
                        case 'OBJECT': {
                            _this.generateObjectResolver(type, isSubscription);
                            break;
                        }
                        case 'INTERFACE':
                        case 'UNION': {
                            _this.generateTypeResolver(type);
                            break;
                        }
                        case 'INPUT_OBJECT':
                        default: {
                            break;
                        }
                    }
                });
                this.resolverObject.push('}');
                return [2 /*return*/, {
                        importHeader: this.importHeader,
                        body: __spreadArray(__spreadArray(__spreadArray([], this.resolverObject, true), this.resolverInterfaces, true), Object.values(this.resolverResult).map(function (v) { return v.join('\n'); }), true)
                    }];
            });
        });
    };
    TSResolverGenerator.prototype.generateCustomScalarResolver = function (scalarType) {
        this.resolverObject.push("".concat(scalarType.name).concat(this.getModifier(), ": GraphQLScalarType;"));
    };
    TSResolverGenerator.prototype.generateTypeResolver = function (type) {
        var _a, _b;
        var possbileTypes = type.possibleTypes.map(function (pt) { return "'".concat(pt.name, "'"); });
        var interfaceName = "".concat(this.options.typePrefix).concat(type.name, "TypeResolver");
        var infoModifier = this.options.optionalResolverInfo ? '?' : '';
        (_a = this.resolverInterfaces).push.apply(_a, [
            "export interface ".concat(interfaceName, "<TParent = ").concat(this.guessTParent(type.name), "> {"),
            // tslint:disable-next-line:max-line-length
            "(parent: TParent, context: ".concat(this.contextType, ", info").concat(infoModifier, ": GraphQLResolveInfo): ").concat(possbileTypes.join(' | '), " | Promise<").concat(possbileTypes.join(' | '), ">;"),
            '}'
        ]);
        (_b = this.resolverObject).push.apply(_b, [
            "".concat(type.name).concat(this.getModifier(), ": {"),
            "__resolveType: ".concat(interfaceName),
            '};',
            ''
        ]);
    };
    TSResolverGenerator.prototype.generateObjectResolver = function (objectType, isSubscription) {
        var _a, _b;
        var _this = this;
        if (isSubscription === void 0) { isSubscription = false; }
        var typeResolverName = "".concat(this.options.typePrefix).concat(objectType.name, "TypeResolver");
        var typeResolverBody = [];
        var fieldResolversTypeDefs = [];
        objectType.fields.forEach(function (field) {
            // generate args type
            var argsType = '{}';
            var uppercaseFirstFieldName = (0, utils_1.toUppercaseFirst)(field.name);
            if (field.args.length > 0) {
                argsType = "".concat(objectType.name, "To").concat(uppercaseFirstFieldName, "Args");
                var argsBody_1 = [];
                field.args.forEach(function (arg) {
                    var _a = (0, utils_1.createFieldRef)(arg, _this.options.typePrefix, false), fieldName = _a.fieldName, fieldType = _a.fieldType;
                    argsBody_1.push("".concat(fieldName, ": ").concat(fieldType, ";"));
                });
                fieldResolversTypeDefs.push.apply(fieldResolversTypeDefs, __spreadArray(__spreadArray([
                    "export interface ".concat(argsType, " {")
                ], argsBody_1, true), [
                    '}'
                ], false));
            }
            // generate field type
            var fieldResolverName = "".concat(objectType.name, "To").concat(uppercaseFirstFieldName, "Resolver");
            var TParent = _this.guessTParent(objectType.name);
            var TResult = _this.guessTResult(field);
            var infoModifier = _this.options.optionalResolverInfo ? '?' : '';
            var returnType = _this.options.asyncResult === 'always'
                ? 'Promise<TResult>'
                : !!_this.options.asyncResult
                    ? 'TResult | Promise<TResult>'
                    : 'TResult';
            var subscriptionReturnType = _this.options.asyncResult ? 'AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>' : 'AsyncIterator<TResult>';
            var fieldResolverTypeDef = !isSubscription
                ? [
                    "export interface ".concat(fieldResolverName, "<TParent = ").concat(TParent, ", TResult = ").concat(TResult, "> {"),
                    "(parent: TParent, args: ".concat(argsType, ", context: ").concat(_this.contextType, ", info").concat(infoModifier, ": GraphQLResolveInfo): ").concat(returnType, ";"),
                    '}',
                    ''
                ]
                : [
                    "export interface ".concat(fieldResolverName, "<TParent = ").concat(TParent, ", TResult = ").concat(TResult, "> {"),
                    // tslint:disable-next-line:max-line-length
                    "resolve".concat(_this.getModifier(), ": (parent: TParent, args: ").concat(argsType, ", context: ").concat(_this.contextType, ", info").concat(infoModifier, ": GraphQLResolveInfo) => ").concat(returnType, ";"),
                    // tslint:disable-next-line:max-line-length
                    "subscribe: (parent: TParent, args: ".concat(argsType, ", context: ").concat(_this.contextType, ", info").concat(infoModifier, ": GraphQLResolveInfo) => ").concat(subscriptionReturnType, ";"),
                    '}',
                    ''
                ];
            fieldResolversTypeDefs.push.apply(fieldResolversTypeDefs, fieldResolverTypeDef);
            typeResolverBody.push.apply(typeResolverBody, [
                "".concat(field.name).concat(_this.getModifier(), ": ").concat(fieldResolverName, "<TParent>;")
            ]);
        });
        (_a = this.resolverInterfaces).push.apply(_a, __spreadArray(__spreadArray(__spreadArray([
            "export interface ".concat(typeResolverName, "<TParent = ").concat(this.guessTParent(objectType.name), "> {")
        ], typeResolverBody, true), [
            '}',
            ''
        ], false), fieldResolversTypeDefs, true));
        // add the type resolver to resolver object
        (_b = this.resolverObject).push.apply(_b, [
            "".concat(objectType.name).concat(this.getModifier(), ": ").concat(typeResolverName, ";")
        ]);
    };
    // optional or required
    TSResolverGenerator.prototype.getModifier = function () {
        return this.options.requireResolverTypes ? '' : '?';
    };
    TSResolverGenerator.prototype.guessTParent = function (parentTypeName) {
        if (!this.options.smartTParent) {
            return 'any';
        }
        if (this.isRootType(parentTypeName)) {
            return this.options.rootValueType;
        }
        return "".concat(this.options.typePrefix).concat(parentTypeName);
    };
    TSResolverGenerator.prototype.guessTResult = function (field) {
        if (!this.options.smartTResult) {
            return 'any';
        }
        // e.g: GQLUserResult
        // TODO: this is an attempt to implement #8
        // it's not done yet (this.resolverResult is always empty)
        var TResultName = "".concat(this.options.typePrefix).concat(field.name, "Result");
        if (this.resolverResult[TResultName]) {
            return TResultName;
        }
        // TODO: build TResult
        // set strict-nulls to always true so that fieldType could possibly null;
        var fieldType = (0, utils_1.createFieldRef)(field, this.options.typePrefix, true).fieldType;
        return fieldType;
    };
    TSResolverGenerator.prototype.isRootType = function (typeName) {
        return !![
            this.queryType, this.mutationType, this.subscriptionType
        ].find(function (type) { return !!type && type.name === typeName; });
    };
    return TSResolverGenerator;
}());
exports.TSResolverGenerator = TSResolverGenerator;
