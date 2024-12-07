import type { DirectusField, DirectusFolder } from "@directus/sdk";

export function getRecipe(
    field: string,
    publicFolder: DirectusFolder,
): NestedPartial<DirectusField> {
    return {
        field: field,
        type: "uuid",
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
            foreign_key_table: "directus_files",
            foreign_key_column: "id",
            comment: null,
        },
        meta: {
            field: field,
            special: ["file"],
            interface: "file-image",
            options: {
                folder: publicFolder.id,
            },
            display: "image",
            display_options: null,
            readonly: false,
            hidden: false,
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
