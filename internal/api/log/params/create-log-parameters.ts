import BaseParameters from "../../parameters";
import { LevelEnum } from "./level-enum";

export class CreateLogParameters extends BaseParameters {
    public addLogRecord(message: string, context: object, level: LevelEnum, channel: string, date: Date): CreateLogParameters {
        const records: Array<object> = this["parameters"]["records"] || [];

        records.push({
            message,
            context,
            level_name: level,
            channel,
            datetime: date.toISOString()
        });

        this.set("records", records);

        return this;
    };
}
