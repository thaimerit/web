import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Breadcrumbs from '../../components/breadcrumbs'
import Containner from '../../components/containner'
import PageTitle from '../../components/page-title'
import { API } from '../../service/apiService'
import { filterHtmlUtil } from '../../utils/filterHtmlUtil'

function PageDetail({ session, page }) {

    const router = useRouter()
    const { slug } = router.query

    useEffect(() => {
        API.init(session)
    }, [])

    return (
        <Containner>
            <div className='py-4'>
                <Breadcrumbs items={[
                    {
                        label: "หน้าหลัก",
                        url: "/",
                    },
                    {
                        label: page.name,
                        url: "/" + page.slug,
                    },
                ]} />
            </div>
            <PageTitle>{page?.name}</PageTitle>

            <div dangerouslySetInnerHTML={{ __html: filterHtmlUtil(page.description) }}></div>


        </Containner>
    )
}

export default PageDetail

export async function getServerSideProps(context) {
    const session = await getSession(context)

    let slug = context.params.slug

    API.init(session)
    let page = null

    try {

        page = await API.getPageBySlug(slug)

        if (!page) {
            return {
                notFound: true
            }
        }
    } catch (error) {
        console.log(error)
        return {
            notFound: true
        }
    }

    return {
        props: {
            session,
            page
        },
    }
}