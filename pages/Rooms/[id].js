import { useRouter } from 'next/router'


function Room() {
    const router = useRouter()
    const { id } = router.query


    return (
        <div>
            <h1>room page here</h1>
        </div>
    )
}

export default Room


