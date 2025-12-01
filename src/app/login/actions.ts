
'use server';

import { cookies } from 'next/headers';
import { login as apiLogin, getLastLoginTime, getAccounts } from '../actions';

export async function loginAndSetSession(values: any) {
    const response = await apiLogin(values);

    if (response.success && response.profile) {
        const userProfile = response.profile;
        cookies().set('userProfile', JSON.stringify(userProfile), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });
        
        try {
            // Set last login time cookie
            const loginTimeResponse = await getLastLoginTime(userProfile.userid);
            if (loginTimeResponse.opstatus === 0) {
                const lastLogin = loginTimeResponse.LoginServices[0].Lastlogintime;
                cookies().set('lastLoginTime', lastLogin, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                });
            }

            // Set accounts cookie
            const accountsData = await getAccounts(userProfile.userid, userProfile.CIF_NO);
            if (accountsData.opstatus === 0) {
                 cookies().set('accounts', JSON.stringify(accountsData.payments), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                });
            }

        } catch (e) {
            console.error("Could not fetch additional session data", e);
        }
    }
    
    return response;
}

export async function logout() {
    cookies().delete('userProfile');
    cookies().delete('lastLoginTime');
    cookies().delete('accounts');
}
