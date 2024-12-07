import type { DirectusField } from "@directus/sdk";

export function createFieldRecipe(
    name: string,
    kind: string,
    required: boolean,
    defaultValue?: string | boolean | null,
    opts?: { width: string },
): NestedPartial<DirectusField> {
    switch (kind) {
        case "string":
            return {
                field: name,
                type: "string",
                schema: {
                    data_type: "character varying",
                    is_nullable: !required,
                    default_value: defaultValue || null,
                },
                meta: {
                    required: required,
                    readonly: false,
                    hidden: false,
                    width: opts && opts.width ? (opts.width ?? "full") : "full",
                },
            };
        case "boolean":
            return {
                field: name,
                type: "boolean",
                schema: {
                    data_type: "boolean",
                    default_value: defaultValue || false,
                    generation_expression: null,
                    max_length: null,
                    numeric_precision: null,
                    numeric_scale: null,
                    is_generated: false,
                    is_nullable: !required,
                    is_unique: false,
                    is_indexed: false,
                    is_primary_key: false,
                    has_auto_increment: false,
                    foreign_key_schema: null,
                    foreign_key_table: null,
                    foreign_key_column: null,
                    comment: null,
                },
                meta: {
                    field: name,
                    special: ["cast-boolean"],
                    interface: "boolean",
                    options: null,
                    display: null,
                    display_options: null,
                    readonly: false,
                    hidden: false,
                    width: opts && opts.width ? (opts.width ?? "full") : "full",
                    translations: null,
                    note: null,
                    conditions: null,
                    required: required,
                    group: null,
                    validation: null,
                    validation_message: null,
                },
            };
        default:
            return {};
    }
}
