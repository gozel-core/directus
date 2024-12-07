import type { DirectusField } from "@directus/sdk";

export function getRecipe(): NestedPartial<DirectusField> {
    return {
        field: "user_updated",
        type: "uuid",
        meta: {
            field: "user_updated",
            special: ["user-updated"],
            interface: "select-dropdown-m2o",
            options: {
                template: "{{avatar.$thumbnail}} {{first_name}} {{last_name}}",
            },
            display: "user",
            display_options: null,
            readonly: true,
            hidden: true,
            width: "half",
            translations: null,
            note: null,
            sort: 4,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
        },
        schema: {
            data_type: "uuid",
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
            foreign_key_schema: "public",
            foreign_key_table: "directus_users",
            foreign_key_column: "id",
            comment: null,
        },
    };
}
