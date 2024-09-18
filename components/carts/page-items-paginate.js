import { Pagination } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { API } from '../../service/apiService'
import { t } from 'i18next';
import styles from '../../styles/transaction/PageItems.module.scss'
import { errorHandler, withReactContent } from '../../utils/alertUtil';
import { alertOkButtonColor, primary } from '../../utils/variable'
import PageItemCard from './page-item-card'
import PageItems from './page-items'

export default function PageItemsPaginate({ itemsRender, grid, contentRender, className, apiUrl, watch, params, apiFunction, mapData, pageSize, onResult }) {

    if (!pageSize) pageSize = 5
    if (!params) params = {}

    const MySwal = withReactContent();
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([
        {},
        {},
        {},
        {},
        {},
    ])
    const [paginate, setPagiante] = useState({
        page: 0,
        pageCount: 0,
        pageSize: 0,
        total: 0
    })

    useEffect(() => {
        initData()
    }, [])

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
                ])
            }

            setLoading(true)

            params['pagination[pageSize]'] = pageSize
            params['pagination[page]'] = _params?.page ? _params?.page : 1

            let result = await API.instance.get(apiUrl, {
                params
            })
            
            let items = result.data.data
            let meta = result.data.meta.pagination

            setItems(items)
            setPagiante(meta)
            setLoading(false)

        } catch (error) {
            console.error(error)
        }
    }

    const onDelete = (id) => {
        console.log('on delete');
        console.log(id);
        const orderId = id
        MySwal.fire({
            icon: "error",
            title: t("Confirm Delete"),
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: t("Confirm"),
            confirmButtonColor: primary,
            cancelButtonText: t("Cancel"),

        }).then(async (result) => {
            if (result.isConfirmed) {
                // console.log(data)
                try {
                    await API.updateOrder(orderId, {
                        status : "cancel"
                    })
                    await getItems()
                    // console.log('result ', result );
                    // router.push(`/carts`)

                } catch (error) {

                    let errorMessage = errorHandler(error)

                    MySwal.fire({
                        icon: 'error',
                        title: t("errorTitle"),
                        text: t(errorMessage),
                        confirmButtonText: t('OK'),
                        confirmButtonColor: primary,
                    })
                }
            }
        })
    }

    return <>

        {(items != undefined && items.length > 0) && <div>
                <PageItems grid={grid} itemsRender={itemsRender} items={items} loading={loading} className={className} onDelete={onDelete} />
                <div className='mt-4 flex justify-center '>
                    <Pagination count={paginate.pageCount} shape="rounded" size="small" onChange={handleChangePage} />
                </div>
            </div>
        }
        {(items == undefined || items.length == 0) && <div className='mt-4 flex justify-center '>
                ไม่พบรายการสินค้า
            </div>}
    </>
}