import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface userInfo {
  avatar: string
  name: string
  description: string
}

export interface UserState {
  userInfo: userInfo
}

export function defaultSetting(): UserState {
  return {
    userInfo: {
      avatar: 'https://raw.githubusercontent.com/Chanzhaoyu/chatgpt-web/main/src/assets/avatar.jpg',
      name: 'shunyue',
      description: 'Star on <a href="https://github.com/shunyue1320/chatgpt-app" class="text-blue-500" target="_blank" >Github</a>',
    },
  }
}

export function getLocalState(): UserState {
  const userState = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...userState }
}

export function setLocalState(userState: UserState) {
  ss.set(LOCAL_NAME, userState)
}
