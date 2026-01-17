import { useEffect } from 'react'
import axios from '@axios'
import Header from '@components/Header'

const Test = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('test')
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    return (
        <div>
            <Header heading="Test" description="abc" />
        </div>
    )
}

export default Test
