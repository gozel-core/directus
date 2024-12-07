import type { DirectusField, DirectusFolder } from "@directus/sdk";

export const toolbar = [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "h1",
    "h2",
    "h3",
    "h4",
    "numlist",
    "bullist",
    "removeformat",
    "blockquote",
    "customLink",
    "unlink",
    "customImage",
    "customMedia",
    "table",
    "hr",
    "code",
    "fullscreen",
    "ltr rtl",
];

export function getRecipe(
    field: string,
    publicFolder: DirectusFolder,
): NestedPartial<DirectusField> {
    return {
        field: field,
        type: "text",
        schema: {
            name: field,
            data_type: "text",
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
        meta: {
            field: field,
            special: null,
            interface: "input-rich-text-html",
            options: {
                folder: publicFolder.id,
                toolbar: toolbar,
            },
            display: "formatted-value",
            display_options: {
                format: true,
            },
            readonly: false,
            hidden: false,
            width: "full",
            translations: [
                {
                    language: "en-US",
                    translation: "HTML Content",
                },
                {
                    language: "tr-TR",
                    translation: "HTML İçerik",
                },
            ],
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
        },
    };
}
