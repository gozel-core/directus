import type {
    DirectusClient, StaticTokenClient, RestClient, DirectusCollection, DirectusRelation, DirectusSettings,
    DirectusField, UnpackList
} from '@directus/sdk'

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DIRECTUS_URL: string
            DIRECTUS_TOKEN: string
            DEFAULT_LOCALE?: string
            APP_URL: string
        }
    }

    interface SyncCmdOpts {
        project: string
        store: string
    }

    interface CreateWebsiteModelCmdOpts {
        supportedLocale: string[]
        namespace: string
        owner: string
    }

    interface ReadProjectCmdOpts {
        project: string
        store: string
        staticPath: string
        savePath: string
    }

    type RefDirectusClient =  DirectusClient<RefSchema> & StaticTokenClient<RefSchema> & RestClient<RefSchema>
    type RefDataModel = {
        allCollections: DirectusCollection[]
        systemCollections: DirectusCollection[]
        collections: DirectusCollection[]
        relations: DirectusRelation[]
        fields: DirectusField[]
        directusSettings: DirectusSettings
    }

    interface RefSchema {
        timezones: Timezone[]
        geo_regions: GeoRegions[]
        deploy_settings: DeploySettings[]
        languages: LanguagesCollection[]
        message_catalog: MessageCatalogCollection[]
        message_catalog_translations: MessageCatalogTranslationCollection[]
        items: {
            [index: string]: unknown
        }[]
        singleton: {
            [index: string]: unknown
        }
    }

    interface Timezone {
        id?: number
        status?: 'published' | 'draft' | 'archived'
        name: string
        offset: number
        country: string
    }

    interface GeoRegions {
        id?: number
        status?: 'published' | 'draft' | 'archived'
        type: string
        code: string
        english_name?: string
        native_name?: string
        parent?: number | null
    }

    type LanguagesCollection = {
        id: number
        code: string
        status: string
        name: string
        direction: 'ltr' | 'rtl'
        is_default: boolean
        [index: string]: unknown
    }

    type MessageCatalogCollection = {
        user_created: string
        id: number
        key: string
        translations: number[]
    }

    type MessageCatalogTranslationCollection = {
        user_created: string
        id: number
        message_catalog_id: number
        languages_id: number
        plain_text: string
        enable_html: boolean
        html_text: string
        [index: string]: unknown
    }

    type PagesCollection = {
        id: number
        status: string
        sort: number
        navigation_parent: number
        cover: string
        search_engine_robots_directives: string[]
        canonical_url: string
        routing_identifiers: string[]
        frontend_component: string
        components: number[]
        translations: number[]
        [index: string]: unknown
    }

    type PageTranslationCollection = {
        id: number
        status: string
        title: string
        slug: string
        excerpt: string
        [index: string]: unknown
    }

    type SettingsCollection = {
        maintenance_mode: boolean
        search_engine_indexing: boolean
    }

    interface ModelAnalysis {
        mediaFields: [string, string, { type: 'file', specials: string[] }][]
        htmlFields: [string, string, { type: 'html', specials: string[] }][]
        m2oFields: [string, string, { type: 'm2o', specials: string[], foreign: { table: string, column: string } }][]
        m2mFields: [string, string, { type: 'm2m', specials: string[], intermediate: { table: string, column: string, junction: string, sort: string }, foreign: { table: string, column: string } }][]
        o2mFields: [string, string, { type: 'o2m', specials: string[], foreign: { table: string, column: string, junction: string, sort: string } }][]
        m2aFields: [string, string, { type: 'm2a', specials: string[], intermediate: { table: string, column: string, junction: string, sort: string } }][]
        languagesCollection: DirectusCollection | undefined
        languagesPrimaryKey: DirectusField | undefined
        websitePagesCollection: DirectusCollection | undefined
        websiteNavigationField: DirectusField | undefined
        websiteSettingsCollection: DirectusCollection | undefined
    }

    interface DataAnalysis {
        mediaIds: string[]
        websiteSettings: SettingsCollection | undefined
    }

    type RefData = {
        [index: string]: RefItem | RefItem[]
    }

    type RefItem = {
        [index: string]: unknown
    }

    type PresetName = 'original' | string
    type MediaManifestMap = Map<string, Map<PresetName, MediaManifestItem>>
    type MediaManifestJson = Record<string, Record<PresetName, MediaManifestItem>>

    type MediaManifestOriginalItem = {
        preset: 'original'
        size: number
        path: string
        title?: string
        description?: string
        tags?: string[]
        width?: number
        height?: number
        aspectRatio?: number
    }

    type MediaManifestPresetItem = {
        preset: string
        size: number
        path: string
        width: number
        height: number
        aspectRatio: number
    }

    type MediaManifestItem = MediaManifestOriginalItem | MediaManifestPresetItem

    type DownloadAssetAsArrayBuffer = (id: string, preset?: NonNullable<DirectusSettings['storage_asset_presets']>[0]) => Promise<ArrayBuffer>

    interface DeploySettings {
        project: string
        table_prefix: string | null
        robots_txt: string | null
        custom_resolvers: CustomFieldResolver[]
        collections: string[]
        media_presets: string[]
    }

    interface CustomFieldResolver {
        field_ref: string
        function: string
    }

    type DeployManifestData = Pick<ModelAnalysis, "m2mFields" | "o2mFields" | "htmlFields" | "mediaFields" | "m2oFields" | "m2aFields">
    type DeployManifestFunctions = {
        save: (filepath: string) => Promise<void>
        load: (filepath: string) => Promise<void>
    }
    type DeployManifest = { relationalFields: DeployManifestData, assets: Record<string, string> } & DeployManifestFunctions & Record<string, string>

    interface Abc {
        id: number
        translations: AbcTranslations[]
    }

    interface AbcTranslations {
        id: number
        languages_code: string
        [index: string]: unknown
    }

    type Operation = OperationCreateCollection | OperationCreateField | OperationCreateRelation | OperationDeleteRelation
    type OperationCreateCollection = {
        name: 'CREATE_COLLECTION'
        recipe: NestedPartial<DirectusCollection>
    }
    type OperationCreateField = {
        name: 'CREATE_FIELD'
        recipe: NestedPartial<DirectusField>
    }
    type OperationCreateRelation = {
        name: 'CREATE_RELATION'
        recipe: NestedPartial<DirectusRelation>
    }
    type OperationDeleteRelation = {
        name: 'DELETE_RELATION'
        recipe: {
            field: string
        }
    }

    type NestedPartial<Item extends object> = {
        [Key in keyof Item]?: NonNullable<Item[Key]> extends infer NestedItem ? NestedItem extends object[] ? NestedPartial<UnpackList<NestedItem>>[] | Exclude<Item[Key], NestedItem> : NestedItem extends object ? NestedPartial<NestedItem> | Exclude<Item[Key], NestedItem> : Item[Key] : Item[Key];
    }
}

export {}
