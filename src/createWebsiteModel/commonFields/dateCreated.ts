import type { DirectusField } from "@directus/sdk";

export function getRecipe(): NestedPartial<DirectusField> {
    return {
        field: "date_created",
        type: "timestamp",
        meta: {
            field: "date_created",
            special: ["date-created"],
            interface: "datetime",
            options: null,
            display: "datetime",
            display_options: {
                relative: true,
            },
            readonly: true,
            hidden: true,
            width: "half",
            translations: null,
            note: null,
            sort: 3,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
        },
        schema: {
            data_type: "timestamp with time zone",
            default_value: null,
            generation_expression: null,
            max_length: null,
            numeric_precision: null,
            numeric_scale: null,
            is_generated: false,
            is_nullable: true,
            is_unique: false,
            is_indexed: false,
            is_primary_key: false,
            has_auto_increment: false,
            foreign_key_schema: null,
            foreign_key_table: null,
            foreign_key_column: null,
            comment: null,
        },
    };
}
