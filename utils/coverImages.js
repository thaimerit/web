import { API } from "../service/apiService"

export function getGalleries(items, index, format=null) {
    if(!items) return null
    let img = items[index]
    if (img) {

        if(format){
            try {
                if (img.attributes) {
                    if (img.attributes.formats[format]) {
                        let foramtImage = img.attributes.formats[format]
                        return API.assetUrl(foramtImage.url)
                    }
                }
                return API.assetUrl(img.formats[format].url)
            } catch (error) {
                    
            }
        }

        if (img.attributes) {
            return API.assetUrl(img.attributes.url)
        }
        
        return API.assetUrl(img.url)
    }

    return null
}

export function getCoverImages(items, type, format=null) {
    if(!items) return null
    let img = items.find(o => o.type == type)
    if (img) {
        if (img.image) {

            if(format){
                try {
                    if (img.image.data?.attributes) {
                        if (img.image.data.attributes.formats[format]) {
                            let foramtImage = img.image.data.attributes.formats[format]
                            return API.assetUrl(foramtImage.url)
                        }
                    }
                    return API.assetUrl(img.image.formats[format].url)
                } catch (error) {
                        
                }
            }

            if (img.image.data?.attributes) {
                return API.assetUrl(img.image.data.attributes.url)
            }

            return API.assetUrl(img.image.url)
        }
    }

    return null
}

export function getCoverImagesNoAttributes(items, type) {
    if(!items) return null
    let img = items.find(o => o.type == type)
    if (img) {
        if (img.image) {

            if (img.image) {
                return API.assetUrl(img.image.url)
            }

            return API.assetUrl(img.image.url)
        }
    }

    return null
}

export function getGalleriesForDetail(items, index) {
    let img = items[index]
    if (img) {

        console.log(img);
        return API.assetUrl(img.attributes.url)
    }

    return null
}

export function getCoverImagesForDetail(items, type) {
    if(!items) return items
    let img = items.find(o => o.type == type)
    if (img) {
        if (img.image) {
            return API.assetUrl(img.image.data.attributes.url)
        }
    }

    return null
}