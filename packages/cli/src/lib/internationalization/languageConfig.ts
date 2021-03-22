/* eslint-disable */
import { getIntl } from "./internationalization";

const intl = getIntl();

export interface IntlMsg {
    commands_build_address: () => string;
    commands_build_description: () => string;
    commands_build_ensRegistry: () => string;
    commands_build_error_outputDirMissingPath: (options: commands_build_error_outputDirMissingPath_Options) => string;
    commands_build_error_resolution: () => string;
    commands_build_error_testEnsAddressMissing: (options: commands_build_error_testEnsAddressMissing_Options) => string;
    commands_build_error_testEnsNodeMissing: (options: commands_build_error_testEnsNodeMissing_Options) => string;
    commands_build_ethProvider: () => string;
    commands_build_keypressListener_exit: () => string;
    commands_build_keypressListener_watching: () => string;
    commands_build_options_e: () => string;
    commands_build_options_e_address: () => string;
    commands_build_options_e_domain: () => string;
    commands_build_options_h: () => string;
    commands_build_options_i: () => string;
    commands_build_options_i_node: () => string;
    commands_build_options_o: () => string;
    commands_build_options_o_path: () => string;
    commands_build_options_options: () => string;
    commands_build_options_t: () => string;
    commands_build_options_w: () => string;
    commands_build_uriViewers: () => string;
    commands_codegen_description: () => string;
    commands_codegen_error_domain: () => string;
    commands_codegen_options_e: () => string;
    commands_codegen_options_e_address: () => string;
    commands_codegen_options_genFile: () => string;
    commands_codegen_options_genFilePath: () => string;
    commands_codegen_options_h: () => string;
    commands_codegen_options_i: () => string;
    commands_codegen_options_i_node: () => string;
    commands_codegen_options_m: () => string;
    commands_build_options_manifest: () => string;
    commands_codegen_options_o: () => string;
    commands_codegen_options_o_path: () => string;
    commands_options_options: () => string;
    commands_codegen_success: () => string;
    commands_create_description: () => string;
    commands_create_directoryExists: (options: commands_create_directoryExists_Options) => string;
    commands_create_error_commandFail: (options: commands_create_error_commandFail_Options) => string;
    commands_create_error_noCommand: () => string;
    commands_create_error_noLang: () => string;
    commands_create_error_noName: () => string;
    commands_create_error_outputDirMissingPath: (options: commands_create_error_outputDirMissingPath_Options) => string;
    commands_create_error_unrecognizedCommand: () => string;
    commands_create_error_unrecognizedLanguage: () => string;
    commands_create_options_command: () => string;
    commands_create_options_commands: () => string;
    commands_create_options_createApp: () => string;
    commands_create_options_createPlugin: () => string;
    commands_create_options_createProject: () => string;
    commands_create_options_h: () => string;
    commands_create_options_lang: () => string;
    commands_create_options_langs: () => string;
    commands_create_options_o: () => string;
    commands_create_options_o_path: () => string;
    commands_create_options_projectName: () => string;
    commands_create_options_recipeScript: () => string;
    commands_create_overwritePrompt: () => string;
    commands_create_overwriting: (options: commands_create_overwriting_Options) => string;
    commands_create_readyDapp: () => string;
    commands_create_readyPlugin: () => string;
    commands_create_readyProtocol: () => string;
    commands_create_settingUp: () => string;
    commands_query_description: () => string;
    commands_query_error_missingScript: (options: commands_query_error_missingScript_Options) => string;
    commands_query_error_noApi: () => string;
    commands_query_error_readFail: (options: commands_query_error_readFail_Options) => string;
    commands_testEnv_description: () => string;
    commands_testEnv_error_never: () => string;
    commands_testEnv_error_noCommand: () => string;
    commands_testEnv_error_unrecognizedCommand: (options: commands_testEnv_error_unrecognizedCommand_Options) => string;
    commands_testEnv_options_command: () => string;
    commands_testEnv_options_start: () => string;
    commands_testEnv_options_stop: () => string;
    commands_testEnv_shutdown_error: () => string;
    commands_testEnv_shutdown_text: () => string;
    commands_testEnv_shutdown_warning: () => string;
    commands_testEnv_startup_error: () => string;
    commands_testEnv_startup_text: () => string;
    commands_testEnv_startup_warning: () => string;
    commands_w3_error_notACommand: () => string;
    commands_w3_helpPrompt: (options: commands_w3_helpPrompt_Options) => string;
    lib_codeGenerator_genCodeError: () => string;
    lib_codeGenerator_genCodeText: () => string;
    lib_codeGenerator_genCodeWarning: () => string;
    lib_codeGenerator_genTemplateStep: (options: lib_codeGenerator_genTemplateStep_Options) => string;
    lib_codeGenerator_wrongGenFile: () => string;
    lib_codeGenerator_templateNoModify: () => string;
    lib_codeGenerator_noRunMethod: () => string;
    lib_compiler_compileError: () => string;
    lib_compiler_compileText: () => string;
    lib_compiler_compileWarning: () => string;
    lib_compiler_failedSchemaReturn: () => string;
    lib_compiler_missingDefinition: (options: lib_compiler_missingDefinition_Options) => string;
    lib_compiler_step: () => string;
    lib_compiler_noNodeModules: (options: lib_compiler_noNodeModules_Options) => string;
    lib_compiler_noInit: () => string;
    lib_compiler_noInvoke: () => string;
    lib_generators_projectGenerator_fallback: () => string;
    lib_generators_projectGenerator_offline: () => string;
    lib_helpers_manifest_loadError: (options: lib_helpers_manifest_loadError_Options) => string;
    lib_helpers_manifest_loadText: (options: lib_helpers_manifest_loadText_Options) => string;
    lib_helpers_manifest_loadWarning: (options: lib_helpers_manifest_loadWarning_Options) => string;
    lib_helpers_manifest_outputError: (options: lib_helpers_manifest_outputError_Options) => string;
    lib_helpers_manifest_outputText: (options: lib_helpers_manifest_outputText_Options) => string;
    lib_helpers_manifest_outputWarning: (options: lib_helpers_manifest_outputWarning_Options) => string;
    lib_helpers_manifest_unableToDump: (options: lib_helpers_manifest_unableToDump_Options) => string;
    lib_helpers_manifest_unableToLoad: (options: lib_helpers_manifest_unableToLoad_Options) => string;
    lib_helpers_parameters_unexpectedValue: (options: lib_helpers_parameters_unexpectedValue_Options) => string;
    lib_publishers_ipfsPublisher_urlMalformed: () => string;
    lib_watcher_alreadyWatching: (options: lib_watcher_alreadyWatching_Options) => string;
}

export interface IntlStrings {
    commands_build_address: string;
    commands_build_description: string;
    commands_build_ensRegistry: string;
    commands_build_error_outputDirMissingPath: string;
    commands_build_error_resolution: string;
    commands_build_error_testEnsAddressMissing: string;
    commands_build_error_testEnsNodeMissing: string;
    commands_build_ethProvider: string;
    commands_build_keypressListener_exit: string;
    commands_build_keypressListener_watching: string;
    commands_build_options_e: string;
    commands_build_options_e_address: string;
    commands_build_options_e_domain: string;
    commands_build_options_h: string;
    commands_build_options_i: string;
    commands_build_options_i_node: string;
    commands_build_options_o: string;
    commands_build_options_o_path: string;
    commands_build_options_options: string;
    commands_build_options_t: string;
    commands_build_options_w: string;
    commands_build_uriViewers: string;
    commands_codegen_description: string;
    commands_codegen_error_domain: string;
    commands_codegen_options_e: string;
    commands_codegen_options_e_address: string;
    commands_codegen_options_genFile: string;
    commands_codegen_options_genFilePath: string;
    commands_codegen_options_h: string;
    commands_codegen_options_i: string;
    commands_codegen_options_i_node: string;
    commands_codegen_options_m: string;
    commands_build_options_manifest: string;
    commands_codegen_options_o: string;
    commands_codegen_options_o_path: string;
    commands_options_options: string;
    commands_codegen_success: string;
    commands_create_description: string;
    commands_create_directoryExists: string;
    commands_create_error_commandFail: string;
    commands_create_error_noCommand: string;
    commands_create_error_noLang: string;
    commands_create_error_noName: string;
    commands_create_error_outputDirMissingPath: string;
    commands_create_error_unrecognizedCommand: string;
    commands_create_error_unrecognizedLanguage: string;
    commands_create_options_command: string;
    commands_create_options_commands: string;
    commands_create_options_createApp: string;
    commands_create_options_createPlugin: string;
    commands_create_options_createProject: string;
    commands_create_options_h: string;
    commands_create_options_lang: string;
    commands_create_options_langs: string;
    commands_create_options_o: string;
    commands_create_options_o_path: string;
    commands_create_options_projectName: string;
    commands_create_options_recipeScript: string;
    commands_create_overwritePrompt: string;
    commands_create_overwriting: string;
    commands_create_readyDapp: string;
    commands_create_readyPlugin: string;
    commands_create_readyProtocol: string;
    commands_create_settingUp: string;
    commands_query_description: string;
    commands_query_error_missingScript: string;
    commands_query_error_noApi: string;
    commands_query_error_readFail: string;
    commands_testEnv_description: string;
    commands_testEnv_error_never: string;
    commands_testEnv_error_noCommand: string;
    commands_testEnv_error_unrecognizedCommand: string;
    commands_testEnv_options_command: string;
    commands_testEnv_options_start: string;
    commands_testEnv_options_stop: string;
    commands_testEnv_shutdown_error: string;
    commands_testEnv_shutdown_text: string;
    commands_testEnv_shutdown_warning: string;
    commands_testEnv_startup_error: string;
    commands_testEnv_startup_text: string;
    commands_testEnv_startup_warning: string;
    commands_w3_error_notACommand: string;
    commands_w3_helpPrompt: string;
    lib_codeGenerator_genCodeError: string;
    lib_codeGenerator_genCodeText: string;
    lib_codeGenerator_genCodeWarning: string;
    lib_codeGenerator_genTemplateStep: string;
    lib_codeGenerator_wrongGenFile: string;
    lib_codeGenerator_templateNoModify: string;
    lib_codeGenerator_noRunMethod: string;
    lib_compiler_compileError: string;
    lib_compiler_compileText: string;
    lib_compiler_compileWarning: string;
    lib_compiler_failedSchemaReturn: string;
    lib_compiler_missingDefinition: string;
    lib_compiler_step: string;
    lib_compiler_noNodeModules: string;
    lib_compiler_noInit: string;
    lib_compiler_noInvoke: string;
    lib_generators_projectGenerator_fallback: string;
    lib_generators_projectGenerator_offline: string;
    lib_helpers_manifest_loadError: string;
    lib_helpers_manifest_loadText: string;
    lib_helpers_manifest_loadWarning: string;
    lib_helpers_manifest_outputError: string;
    lib_helpers_manifest_outputText: string;
    lib_helpers_manifest_outputWarning: string;
    lib_helpers_manifest_unableToDump: string;
    lib_helpers_manifest_unableToLoad: string;
    lib_helpers_parameters_unexpectedValue: string;
    lib_publishers_ipfsPublisher_urlMalformed: string;
    lib_watcher_alreadyWatching: string;
}

export const intlMsg: IntlMsg = {
    commands_build_address: (): string => intl.formatMessage({ id: "commands_build_address", defaultMessage: "ENS Address" }),
    commands_build_description: (): string => intl.formatMessage({ id: "commands_build_description", defaultMessage: "Builds a Web3API and (optionally) uploads it to IPFS" }),
    commands_build_ensRegistry: (): string => intl.formatMessage({ id: "commands_build_ensRegistry", defaultMessage: "ENS Registry" }),
    commands_build_error_outputDirMissingPath: (options: commands_build_error_outputDirMissingPath_Options): string => intl.formatMessage({ id: "commands_build_error_outputDirMissingPath", defaultMessage: "{option} option missing {argument} argument" }, options),
    commands_build_error_resolution: (): string => intl.formatMessage({ id: "commands_build_error_resolution", defaultMessage: "ENS Resolution Failed" }),
    commands_build_error_testEnsAddressMissing: (options: commands_build_error_testEnsAddressMissing_Options): string => intl.formatMessage({ id: "commands_build_error_testEnsAddressMissing", defaultMessage: "{option} option missing {argument} argument" }, options),
    commands_build_error_testEnsNodeMissing: (options: commands_build_error_testEnsNodeMissing_Options): string => intl.formatMessage({ id: "commands_build_error_testEnsNodeMissing", defaultMessage: "{option} option requires the {required} option" }, options),
    commands_build_ethProvider: (): string => intl.formatMessage({ id: "commands_build_ethProvider", defaultMessage: "Ethereum Provider" }),
    commands_build_keypressListener_exit: (): string => intl.formatMessage({ id: "commands_build_keypressListener_exit", defaultMessage: "Exit: [CTRL + C], [ESC], or [Q]" }),
    commands_build_keypressListener_watching: (): string => intl.formatMessage({ id: "commands_build_keypressListener_watching", defaultMessage: "Watching" }),
    commands_build_options_e: (): string => intl.formatMessage({ id: "commands_build_options_e", defaultMessage: "Publish the package to a test ENS domain locally (requires --ipfs)" }),
    commands_build_options_e_address: (): string => intl.formatMessage({ id: "commands_build_options_e_address", defaultMessage: "address" }),
    commands_build_options_e_domain: (): string => intl.formatMessage({ id: "commands_build_options_e_domain", defaultMessage: "domain" }),
    commands_build_options_h: (): string => intl.formatMessage({ id: "commands_build_options_h", defaultMessage: "Show usage information" }),
    commands_build_options_i: (): string => intl.formatMessage({ id: "commands_build_options_i", defaultMessage: "Upload build results to an IPFS node (default: dev-server's node)" }),
    commands_build_options_i_node: (): string => intl.formatMessage({ id: "commands_build_options_i_node", defaultMessage: "node" }),
    commands_build_options_o: (): string => intl.formatMessage({ id: "commands_build_options_o", defaultMessage: "Output directory for build results (default: build/)" }),
    commands_build_options_o_path: (): string => intl.formatMessage({ id: "commands_build_options_o_path", defaultMessage: "path" }),
    commands_build_options_options: (): string => intl.formatMessage({ id: "commands_build_options_options", defaultMessage: "options" }),
    commands_build_options_t: (): string => intl.formatMessage({ id: "commands_build_options_t", defaultMessage: "Use the development server's ENS instance" }),
    commands_build_options_w: (): string => intl.formatMessage({ id: "commands_build_options_w", defaultMessage: "Automatically rebuild when changes are made (default: false)" }),
    commands_build_uriViewers: (): string => intl.formatMessage({ id: "commands_build_uriViewers", defaultMessage: "URI Viewers" }),
    commands_codegen_description: (): string => intl.formatMessage({ id: "commands_codegen_description", defaultMessage: "Auto-generate API Types" }),
    commands_codegen_error_domain: (): string => intl.formatMessage({ id: "commands_codegen_error_domain", defaultMessage: "domain" }),
    commands_codegen_options_e: (): string => intl.formatMessage({ id: "commands_codegen_options_e", defaultMessage: "ENS address to lookup external schemas (default: 0x0000...2e1e)" }),
    commands_codegen_options_e_address: (): string => intl.formatMessage({ id: "commands_codegen_options_e_address", defaultMessage: "address" }),
    commands_codegen_options_genFile: (): string => intl.formatMessage({ id: "commands_codegen_options_genFile", defaultMessage: "Generation file" }),
    commands_codegen_options_genFilePath: (): string => intl.formatMessage({ id: "commands_codegen_options_genFilePath", defaultMessage: "Path to the generation file (default" }),
    commands_codegen_options_h: (): string => intl.formatMessage({ id: "commands_codegen_options_h", defaultMessage: "Show usage information" }),
    commands_codegen_options_i: (): string => intl.formatMessage({ id: "commands_codegen_options_i", defaultMessage: "IPFS node to load external schemas (default: dev-server's node)" }),
    commands_codegen_options_i_node: (): string => intl.formatMessage({ id: "commands_codegen_options_i_node", defaultMessage: "node" }),
    commands_codegen_options_m: (): string => intl.formatMessage({ id: "commands_codegen_options_m", defaultMessage: "Path to the Web3API manifest file (default" }),
    commands_build_options_manifest: (): string => intl.formatMessage({ id: "commands_build_options_manifest", defaultMessage: "manifest" }),
    commands_codegen_options_o: (): string => intl.formatMessage({ id: "commands_codegen_options_o", defaultMessage: "Output directory for generated types (default: types/)" }),
    commands_codegen_options_o_path: (): string => intl.formatMessage({ id: "commands_codegen_options_o_path", defaultMessage: "path" }),
    commands_options_options: (): string => intl.formatMessage({ id: "commands_options_options", defaultMessage: "options" }),
    commands_codegen_success: (): string => intl.formatMessage({ id: "commands_codegen_success", defaultMessage: "Types were generated successfully" }),
    commands_create_description: (): string => intl.formatMessage({ id: "commands_create_description", defaultMessage: "Create a new project with w3 CLI" }),
    commands_create_directoryExists: (options: commands_create_directoryExists_Options): string => intl.formatMessage({ id: "commands_create_directoryExists", defaultMessage: "Directory with name {dir} already exists" }, options),
    commands_create_error_commandFail: (options: commands_create_error_commandFail_Options): string => intl.formatMessage({ id: "commands_create_error_commandFail", defaultMessage: "Command failed: {error}" }, options),
    commands_create_error_noCommand: (): string => intl.formatMessage({ id: "commands_create_error_noCommand", defaultMessage: "Please provide a command" }),
    commands_create_error_noLang: (): string => intl.formatMessage({ id: "commands_create_error_noLang", defaultMessage: "Please provide a language" }),
    commands_create_error_noName: (): string => intl.formatMessage({ id: "commands_create_error_noName", defaultMessage: "Please provide a project name" }),
    commands_create_error_outputDirMissingPath: (options: commands_create_error_outputDirMissingPath_Options): string => intl.formatMessage({ id: "commands_create_error_outputDirMissingPath", defaultMessage: "{option} option missing {argument} argument" }, options),
    commands_create_error_unrecognizedCommand: (): string => intl.formatMessage({ id: "commands_create_error_unrecognizedCommand", defaultMessage: "Unrecognized command" }),
    commands_create_error_unrecognizedLanguage: (): string => intl.formatMessage({ id: "commands_create_error_unrecognizedLanguage", defaultMessage: "Unrecognized language" }),
    commands_create_options_command: (): string => intl.formatMessage({ id: "commands_create_options_command", defaultMessage: "command" }),
    commands_create_options_commands: (): string => intl.formatMessage({ id: "commands_create_options_commands", defaultMessage: "Commands" }),
    commands_create_options_createApp: (): string => intl.formatMessage({ id: "commands_create_options_createApp", defaultMessage: "Create a Web3API application" }),
    commands_create_options_createPlugin: (): string => intl.formatMessage({ id: "commands_create_options_createPlugin", defaultMessage: "Create a Web3API plugin" }),
    commands_create_options_createProject: (): string => intl.formatMessage({ id: "commands_create_options_createProject", defaultMessage: "Create a Web3API project" }),
    commands_create_options_h: (): string => intl.formatMessage({ id: "commands_create_options_h", defaultMessage: "Show usage information" }),
    commands_create_options_lang: (): string => intl.formatMessage({ id: "commands_create_options_lang", defaultMessage: "lang" }),
    commands_create_options_langs: (): string => intl.formatMessage({ id: "commands_create_options_langs", defaultMessage: "langs" }),
    commands_create_options_o: (): string => intl.formatMessage({ id: "commands_create_options_o", defaultMessage: "Output directory for the new project" }),
    commands_create_options_o_path: (): string => intl.formatMessage({ id: "commands_create_options_o_path", defaultMessage: "path" }),
    commands_create_options_projectName: (): string => intl.formatMessage({ id: "commands_create_options_projectName", defaultMessage: "project-name" }),
    commands_create_options_recipeScript: (): string => intl.formatMessage({ id: "commands_create_options_recipeScript", defaultMessage: "recipe-script" }),
    commands_create_overwritePrompt: (): string => intl.formatMessage({ id: "commands_create_overwritePrompt", defaultMessage: "Do you want to overwrite this directory?" }),
    commands_create_overwriting: (options: commands_create_overwriting_Options): string => intl.formatMessage({ id: "commands_create_overwriting", defaultMessage: "Overwriting {dir}..." }, options),
    commands_create_readyDapp: (): string => intl.formatMessage({ id: "commands_create_readyDapp", defaultMessage: "You are ready to build a dApp using Web3API" }),
    commands_create_readyPlugin: (): string => intl.formatMessage({ id: "commands_create_readyPlugin", defaultMessage: "You are ready to build a plugin into a Web3API" }),
    commands_create_readyProtocol: (): string => intl.formatMessage({ id: "commands_create_readyProtocol", defaultMessage: "You are ready to turn your protocol into a Web3API" }),
    commands_create_settingUp: (): string => intl.formatMessage({ id: "commands_create_settingUp", defaultMessage: "Setting everything up..." }),
    commands_query_description: (): string => intl.formatMessage({ id: "commands_query_description", defaultMessage: "Query Web3APIs using recipe scripts" }),
    commands_query_error_missingScript: (options: commands_query_error_missingScript_Options): string => intl.formatMessage({ id: "commands_query_error_missingScript", defaultMessage: "Required argument {script} is missing" }, options),
    commands_query_error_noApi: (): string => intl.formatMessage({ id: "commands_query_error_noApi", defaultMessage: "API needs to be initialized" }),
    commands_query_error_readFail: (options: commands_query_error_readFail_Options): string => intl.formatMessage({ id: "commands_query_error_readFail", defaultMessage: "Failed to read query {query}" }, options),
    commands_testEnv_description: (): string => intl.formatMessage({ id: "commands_testEnv_description", defaultMessage: "Manage a test environment for Web3API" }),
    commands_testEnv_error_never: (): string => intl.formatMessage({ id: "commands_testEnv_error_never", defaultMessage: "This should never happen..." }),
    commands_testEnv_error_noCommand: (): string => intl.formatMessage({ id: "commands_testEnv_error_noCommand", defaultMessage: "No command given" }),
    commands_testEnv_error_unrecognizedCommand: (options: commands_testEnv_error_unrecognizedCommand_Options): string => intl.formatMessage({ id: "commands_testEnv_error_unrecognizedCommand", defaultMessage: "Unrecognized command: {command}" }, options),
    commands_testEnv_options_command: (): string => intl.formatMessage({ id: "commands_testEnv_options_command", defaultMessage: "command" }),
    commands_testEnv_options_start: (): string => intl.formatMessage({ id: "commands_testEnv_options_start", defaultMessage: "Startup the test env" }),
    commands_testEnv_options_stop: (): string => intl.formatMessage({ id: "commands_testEnv_options_stop", defaultMessage: "Shutdown the test env" }),
    commands_testEnv_shutdown_error: (): string => intl.formatMessage({ id: "commands_testEnv_shutdown_error", defaultMessage: "Failed to shutdown test environment" }),
    commands_testEnv_shutdown_text: (): string => intl.formatMessage({ id: "commands_testEnv_shutdown_text", defaultMessage: "Shutting down test environment..." }),
    commands_testEnv_shutdown_warning: (): string => intl.formatMessage({ id: "commands_testEnv_shutdown_warning", defaultMessage: "Warning shutting down test environment" }),
    commands_testEnv_startup_error: (): string => intl.formatMessage({ id: "commands_testEnv_startup_error", defaultMessage: "Failed to start test environment" }),
    commands_testEnv_startup_text: (): string => intl.formatMessage({ id: "commands_testEnv_startup_text", defaultMessage: "Starting test environment..." }),
    commands_testEnv_startup_warning: (): string => intl.formatMessage({ id: "commands_testEnv_startup_warning", defaultMessage: "Warning starting test environment" }),
    commands_w3_error_notACommand: (): string => intl.formatMessage({ id: "commands_w3_error_notACommand", defaultMessage: "is not a command" }),
    commands_w3_helpPrompt: (options: commands_w3_helpPrompt_Options): string => intl.formatMessage({ id: "commands_w3_helpPrompt", defaultMessage: "Type {command} to view common commands" }, options),
    lib_codeGenerator_genCodeError: (): string => intl.formatMessage({ id: "lib_codeGenerator_genCodeError", defaultMessage: "Failed to generate types" }),
    lib_codeGenerator_genCodeText: (): string => intl.formatMessage({ id: "lib_codeGenerator_genCodeText", defaultMessage: "Generate types" }),
    lib_codeGenerator_genCodeWarning: (): string => intl.formatMessage({ id: "lib_codeGenerator_genCodeWarning", defaultMessage: "Warnings while generating types" }),
    lib_codeGenerator_genTemplateStep: (options: lib_codeGenerator_genTemplateStep_Options): string => intl.formatMessage({ id: "lib_codeGenerator_genTemplateStep", defaultMessage: "Generating types from {path}" }, options),
    lib_codeGenerator_wrongGenFile: (): string => intl.formatMessage({ id: "lib_codeGenerator_wrongGenFile", defaultMessage: "The generation file provided is wrong." }),
    lib_codeGenerator_templateNoModify: (): string => intl.formatMessage({ id: "lib_codeGenerator_templateNoModify", defaultMessage: "NOTE: This is generated by 'w3 codegen', DO NOT MODIFY" }),
    lib_codeGenerator_noRunMethod: (): string => intl.formatMessage({ id: "lib_codeGenerator_noRunMethod", defaultMessage: "The generation file provided doesn't have the 'run' method." }),
    lib_compiler_compileError: (): string => intl.formatMessage({ id: "lib_compiler_compileError", defaultMessage: "Failed to compile Web3API" }),
    lib_compiler_compileText: (): string => intl.formatMessage({ id: "lib_compiler_compileText", defaultMessage: "Compile Web3API" }),
    lib_compiler_compileWarning: (): string => intl.formatMessage({ id: "lib_compiler_compileWarning", defaultMessage: "Warnings while compiling Web3API" }),
    lib_compiler_failedSchemaReturn: (): string => intl.formatMessage({ id: "lib_compiler_failedSchemaReturn", defaultMessage: "Schema composer failed to return a combined schema." }),
    lib_compiler_missingDefinition: (options: lib_compiler_missingDefinition_Options): string => intl.formatMessage({ id: "lib_compiler_missingDefinition", defaultMessage: "Missing schema definition for the module {name}" }, options),
    lib_compiler_step: (): string => intl.formatMessage({ id: "lib_compiler_step", defaultMessage: "Compiling WASM module" }),
    lib_compiler_noNodeModules: (options: lib_compiler_noNodeModules_Options): string => intl.formatMessage({ id: "lib_compiler_noNodeModules", defaultMessage: "could not locate {folder} in parent directories of web3api manifest" }, options),
    lib_compiler_noInit: (): string => intl.formatMessage({ id: "lib_compiler_noInit", defaultMessage: "WASM module is missing the _w3_init export. This should never happen..." }),
    lib_compiler_noInvoke: (): string => intl.formatMessage({ id: "lib_compiler_noInvoke", defaultMessage: "WASM module is missing the _w3_invoke export. This should never happen..." }),
    lib_generators_projectGenerator_fallback: (): string => intl.formatMessage({ id: "lib_generators_projectGenerator_fallback", defaultMessage: "Falling back to the local Yarn cache." }),
    lib_generators_projectGenerator_offline: (): string => intl.formatMessage({ id: "lib_generators_projectGenerator_offline", defaultMessage: "You appear to be offline." }),
    lib_helpers_manifest_loadError: (options: lib_helpers_manifest_loadError_Options): string => intl.formatMessage({ id: "lib_helpers_manifest_loadError", defaultMessage: "Failed to load web3api from {path}" }, options),
    lib_helpers_manifest_loadText: (options: lib_helpers_manifest_loadText_Options): string => intl.formatMessage({ id: "lib_helpers_manifest_loadText", defaultMessage: "Load web3api from {path}" }, options),
    lib_helpers_manifest_loadWarning: (options: lib_helpers_manifest_loadWarning_Options): string => intl.formatMessage({ id: "lib_helpers_manifest_loadWarning", defaultMessage: "Warnings loading web3api from {path}" }, options),
    lib_helpers_manifest_outputError: (options: lib_helpers_manifest_outputError_Options): string => intl.formatMessage({ id: "lib_helpers_manifest_outputError", defaultMessage: "Failed to output web3api to {path}" }, options),
    lib_helpers_manifest_outputText: (options: lib_helpers_manifest_outputText_Options): string => intl.formatMessage({ id: "lib_helpers_manifest_outputText", defaultMessage: "Output web3api to {path}" }, options),
    lib_helpers_manifest_outputWarning: (options: lib_helpers_manifest_outputWarning_Options): string => intl.formatMessage({ id: "lib_helpers_manifest_outputWarning", defaultMessage: "Warnings outputting web3api to {path}" }, options),
    lib_helpers_manifest_unableToDump: (options: lib_helpers_manifest_unableToDump_Options): string => intl.formatMessage({ id: "lib_helpers_manifest_unableToDump", defaultMessage: "Unable to dump manifest: {manifest}" }, options),
    lib_helpers_manifest_unableToLoad: (options: lib_helpers_manifest_unableToLoad_Options): string => intl.formatMessage({ id: "lib_helpers_manifest_unableToLoad", defaultMessage: "Unable to load manifest: {path}" }, options),
    lib_helpers_parameters_unexpectedValue: (options: lib_helpers_parameters_unexpectedValue_Options): string => intl.formatMessage({ id: "lib_helpers_parameters_unexpectedValue", defaultMessage: "Unexpected value provided for one or more of {options}. See --help for more information." }, options),
    lib_publishers_ipfsPublisher_urlMalformed: (): string => intl.formatMessage({ id: "lib_publishers_ipfsPublisher_urlMalformed", defaultMessage: "IPFS URL Malformed" }),
    lib_watcher_alreadyWatching: (options: lib_watcher_alreadyWatching_Options): string => intl.formatMessage({ id: "lib_watcher_alreadyWatching", defaultMessage: "Watcher session is already in progress. Directory: {dir}" }, options)
};

export interface commands_build_error_outputDirMissingPath_Options {
    option: string;
    argument: string;
}

export interface commands_build_error_testEnsAddressMissing_Options {
    option: string;
    argument: string;
}

export interface commands_build_error_testEnsNodeMissing_Options {
    option: string;
    required: string;
}

export interface commands_create_directoryExists_Options {
    dir: string;
}

export interface commands_create_error_commandFail_Options {
    error: string;
}

export interface commands_create_error_outputDirMissingPath_Options {
    option: string;
    argument: string;
}

export interface commands_create_overwriting_Options {
    dir: string;
}

export interface commands_query_error_missingScript_Options {
    script: string;
}

export interface commands_query_error_readFail_Options {
    query: string;
}

export interface commands_testEnv_error_unrecognizedCommand_Options {
    command: string;
}

export interface commands_w3_helpPrompt_Options {
    command: string;
}

export interface lib_codeGenerator_genTemplateStep_Options {
    path: string;
}

export interface lib_compiler_missingDefinition_Options {
    name: string;
}

export interface lib_compiler_noNodeModules_Options {
    folder: string;
}

export interface lib_helpers_manifest_loadError_Options {
    path: string;
}

export interface lib_helpers_manifest_loadText_Options {
    path: string;
}

export interface lib_helpers_manifest_loadWarning_Options {
    path: string;
}

export interface lib_helpers_manifest_outputError_Options {
    path: string;
}

export interface lib_helpers_manifest_outputText_Options {
    path: string;
}

export interface lib_helpers_manifest_outputWarning_Options {
    path: string;
}

export interface lib_helpers_manifest_unableToDump_Options {
    manifest: string;
}

export interface lib_helpers_manifest_unableToLoad_Options {
    path: string;
}

export interface lib_helpers_parameters_unexpectedValue_Options {
    options: string;
}

export interface lib_watcher_alreadyWatching_Options {
    dir: string;
}
