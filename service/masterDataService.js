const productTypes = (id) => {
    let items = [
        {
            id: "package",
            name: "ขอพร-แก้บนออนไลน์",
        },
        {
            id: "product",
            name: "สินค้ามงคล",
        }
    ]

    if (id) {
        return items.find(o => o.id == id)
    }

    return items
}

export const MasterDataService = {
    productTypes
}

