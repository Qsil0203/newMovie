import { Request, Response, Router } from 'express'
import axios from 'axios'
import 'dotenv/config'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
	try {
		const type = 'TOP_250_MOVIES'
		const page = 1
		const api = process.env.API_KEY

		const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=${type}&page=${page}`


		const response = await axios.get(url, {
			headers: {
				'X-API-KEY': api ,
				'Content-Type': 'application/json',
			}
		})

		res.status(200).json(response.data)
		
	}catch (e: any) {
		console.error('Ошибка на сервере:', e.message)
		res.status(500).json({ message: 'Не удалось загрузить коллекцию фильмов', error: e.message })
	}
})

export default router
