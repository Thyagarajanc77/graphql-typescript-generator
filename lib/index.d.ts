import { GraphQLSchema } from 'graphql';
import { GenerateTypescriptOptions } from './types';
export { GenerateTypescriptOptions } from './types';
export declare const generateTSTypesAsString: (schema: GraphQLSchema | string, outputPath: string, options: GenerateTypescriptOptions) => Promise<string>;
export declare function generateTypeScriptTypes(schema: GraphQLSchema | string, outputPath: string, options?: GenerateTypescriptOptions): Promise<void>;
//# sourceMappingURL=index.d.ts.map