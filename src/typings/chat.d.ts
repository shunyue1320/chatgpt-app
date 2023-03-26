declare namespace Chat {
	interface Chat {
		dateTime: string
		text: string
		inversion?: boolean
		error?: boolean
		loading?: boolean
		conversationOptions?: ConversationRequest | null
		requestOptions: { prompt: string; options?: ConversationRequest | null }
	}

	interface History {
		title: string
		isEdit: boolean
		uuid: number
	}

	interface ChatState {
		active: number | null
		usingContext: boolean
		history: History[]
		chat: { uuid: number; data: Chat[] }[]
	}
}
