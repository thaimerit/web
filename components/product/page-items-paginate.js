import { Pagination } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { API } from '../../service/apiService'
import styles from '../../styles/product/PageItems.module.scss'
import PageItemCard from '../page-item-card'
import PageItems from './page-items'

export default function PageItemsPaginate({ className, apiUrl, watch, params, apiFunction, mapData, pageSize, onResult }) {

    if(!pageSize) pageSize = 6

    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])
    const [paginate, setPagiante] = useState({
        page: 0,
        pageCount: 0,
        pageSize: 0,
        total: 0
    })

    useEffect(() => {
        initData()
    }, [watch])

    const initData = async () => {
        await getItems()

    }

    const handleChangePage = async (event, newPage) => {
        await getItems({
            page: newPage
        })
    }

    const getItems = async (_params = {}) => {
        try {
            if (!items) {
                setItems([
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                ])
            }

            setLoading(true)

            params['pagination[pageSize]'] = pageSize
            params['pagination[page]'] = _params?.page ? _params?.page : 1

            let result = await API.instance.get(apiUrl, {
                params
            })

            let data = result.data.data
            let meta = result.data.meta.pagination
            let items = data.map(o => mapData(o))

            setItems(items)
            setPagiante(meta)
            setLoading(false)
            if (onResult) onResult(result.data)
        } catch (error) {
            console.error(error)
        }
    }

    return <><PageItems items={items} loading={loading} className={className} />

        <div className='mt-4 flex justify-center '>
            <Pagination count={paginate.pageCount} shape="rounded" size="small" onChange={handleChangePage} />
        </div>
    </>
}