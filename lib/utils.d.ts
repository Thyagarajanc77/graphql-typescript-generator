import { GraphQLSchema, IntrospectionQuery, IntrospectionField, IntrospectionInputValue } from 'graphql';
/**
 * Send introspection query to a graphql schema
 */
export declare const introspectSchema: (schema: GraphQLSchema) => Promise<IntrospectionQuery>;
export declare const introspectSchemaViaLocalFile: (path: string) => Promise<IntrospectionQuery>;
export interface SimpleTypeDescription {
    kind: string;
    name: string;
}
/**
 * Check if type is a built-in graphql type
 */
export declare const isBuiltinType: (type: SimpleTypeDescription) => boolean;
export interface GraphqlDescription {
    description?: string;
    isDeprecated?: boolean;
    deprecationReason?: string;
}
/**
 * Convert description and deprecated directives into JSDoc
 */
export declare const descriptionToJSDoc: (description: GraphqlDescription) => string[];
export interface FieldType {
    fieldType: any;
    refName: string;
    refKind: string;
    fieldModifier: string;
}
export declare const formatTabSpace: (lines: string[], tabSpaces: number) => string[];
export declare const createFieldRef: (field: IntrospectionField | IntrospectionInputValue, prefix: string, strict: boolean) => {
    fieldName: string;
    fieldType: string;
};
export declare const toUppercaseFirst: (value: string) => string;
export declare const pascalCase: (value: string) => string;
//# sourceMappingURL=utils.d.ts.map