import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid';
interface UserState {
    uuid: string
}

export const useUserStore = create<UserState>()(
    persist(
        () => ({
            uuid: uuidv4(),
        }),
        {
            name: 'bear-storage',
        },
    ),
)