export type CustomTrainRequest = {
    modelId: string
    description: string
    buildMode: string
    azureBlobSource: AzureBlobSource
    tags: Tags
}

export type AzureBlobSource = {
    containerUrl: string
    prefix: string
}

export type Tags = {
    createdBy: string
}
