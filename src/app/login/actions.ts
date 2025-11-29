
'use server';

import { cookies } from 'next/headers';
import { login as apiLogin, getLastLoginTime } from '../actions';

export async function loginAndSetSession(values: any) {
    const response = await apiLogin(values);

    if (response.success && response.profile) {
        cookies().set('userProfile', JSON.stringify(response.profile), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });
        
        try {
            const loginTimeResponse = await getLastLoginTime(response.profile.userid);
            if (loginTimeResponse.opstatus === 0) {
                const lastLogin = loginTimeResponse.LoginServices[0].Lastlogintime;
                cookies().set('lastLoginTime', lastLogin, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                });
            }
        } catch (e) {
            console.error("Could not fetch last login time", e);
        }
    }
    
    return response;
}

export async function logout() {
    cookies().delete('userProfile');
    cookies().delete('lastLoginTime');
    cookies().delete('accounts');
}
