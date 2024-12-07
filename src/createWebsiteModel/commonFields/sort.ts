import type { DirectusField } from "@directus/sdk";

export function getRecipe(field = "sort"): NestedPartial<DirectusField> {
    return {
        field: field,
        type: "integer",
        meta: {
            field: field,
            special: null,
            interface: "input",
            options: null,
            display: null,
            display_options: null,
            readonly: false,
            hidden: true,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
        },
        schema: {
            data_type: "integer",
            default_value: null,
            numeric_precision: 32,
            numeric_scale: 0,
            is_generated: false,
            is_nullable: true,
        },
    };
}
