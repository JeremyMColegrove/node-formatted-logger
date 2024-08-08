import FormattedLogger from "./logger";
FormattedLogger.error(new Error("Unkown property 'String' found on Object()"));
FormattedLogger.error(new MediaError());
export default FormattedLogger;
