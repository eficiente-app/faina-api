import moment from "moment";
import validate from "validate.js";

export default function (): void {
  validate.extend(validate.validators.datetime, {
    parse: function (value: any) {
      return +moment.utc(value);
    },
    format: function (value: any, options: any) {
      const format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";

      return moment.utc(value).format(format);
    }
  });
}
