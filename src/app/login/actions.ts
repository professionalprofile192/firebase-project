
'use server';

import { cookies } from 'next/headers';
import { login as apiLogin, getLastLoginTime, getAccounts } from '../actions';

export async function logout() {
    cookies().delete('userProfile');
    cookies().delete('lastLoginTime');
    cookies().delete('accounts');
}
