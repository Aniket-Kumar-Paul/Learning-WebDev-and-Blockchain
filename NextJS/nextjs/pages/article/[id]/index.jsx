import { useRouter } from "next/router"
import Link from "next/link"
import {server} from '../../../config'
import Meta from "../../../components/Meta"

const article = ({article}) => {
    // const router = useRouter()
    // const {id} = router.query

    return (
        <div>
            <Meta title={article.title} />
            <h1>{article.title}</h1>
            <p>{article.body}</p>
            <br/>

            <Link href='/'>Go Back</Link>
        </div>
    )
}

// export const getServerSideProps = async(context) => {
//     const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${context.params.id}`)
//     const article = await res.json() 

//     return {
//         props: {
//             article
//         }
//     }
// }

// we can use getServerSideProps or a combination of getStaticProps & getStaticPaths(faster)

// export const getStaticProps = async (context) => {
//     const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${context.params.id}`)
//     const article = await res.json()

//     return {
//         props: {
//             article
//         }
//     }
// }

// export const getStaticPaths = async () => {
//     const res = await fetch(`https://jsonplaceholder.typicode.com/posts`)
//     const article = await res.json()

//     const ids = article.map(article => article.id)
//     const paths = ids.map(id => ({params: {id: id.toString()}}))

//     return {
//         // paths: {params: {id: '1', id: '2',...}}
//         paths,
//         fallback: false //if we visit something which doesn't exists, it will give 404 error
//     }
// }

export const getStaticProps = async (context) => {
    const res = await fetch(`${server}/api/articles/${context.params.id}`)
    const article = await res.json()

    return {
        props: {
            article
        }
    }
}

export const getStaticPaths = async () => {
    const res = await fetch(`${server}/api/articles`)
    const article = await res.json()

    const ids = article.map(article => article.id)
    const paths = ids.map(id => ({params: {id: id.toString()}}))

    return {
        // paths: {params: {id: '1', id: '2',...}}
        paths,
        fallback: false //if we visit something which doesn't exists, it will give 404 error
    }
}

export default article