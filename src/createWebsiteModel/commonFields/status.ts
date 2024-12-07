import type { DirectusField } from "@directus/sdk";

export function getRecipe(): NestedPartial<DirectusField> {
    return {
        field: "status",
        type: "string",
        schema: {
            name: "status",
            //"table": collection,
            data_type: "character varying",
            default_value: "draft",
            generation_expression: null,
            max_length: 255,
            numeric_precision: null,
            numeric_scale: null,
            is_generated: false,
            is_nullable: false,
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
            //"collection": collection,
            field: "status",
            special: null,
            interface: "select-dropdown",
            options: {
                choices: [
                    {
                        text: "$t:published",
                        value: "published",
                        color: "#2ECDA7",
                    },
                    {
                        text: "$t:draft",
                        value: "draft",
                        color: "#FFC23B",
                    },
                    {
                        text: "$t:archived",
                        value: "archived",
                        color: "#A2B5CD",
                    },
                ],
            },
            display: "labels",
            display_options: {
                showAsDot: true,
                choices: [
                    {
                        text: "$t:published",
                        value: "published",
                        color: "#2ECDA7",
                        foreground: "var(--theme--primary)",
                        background: "var(--theme--primary-background)",
                    },
                    {
                        text: "$t:draft",
                        value: "draft",
                        color: "#FFC23B",
                        foreground: "var(--theme--foreground)",
                        background: "var(--theme--background-normal)",
                    },
                    {
                        text: "$t:archived",
                        value: "archived",
                        color: "#A2B5CD",
                        foreground: "var(--theme--warning)",
                        background: "var(--theme--warning-background)",
                    },
                ],
            },
            readonly: false,
            hidden: false,
            sort: 5,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
        },
    };
}
