'use server';

// This is a placeholder for the actual API call.
// In a real application, this would make a request to your backend,
// which would then securely call the UBL Digital API.
export async function login(values: any) {
  if (values.username === 'raaststp' && values.password === 'Kony@123456') {
    return {
      success: true,
      message: 'Login successful',
      profile: {
        userid: '7884057484',
        firstname: 'raast',
        lastname: 'stp',
      },
    };
  } else {
    return { success: false, message: 'Invalid username or password' };
  }
}

// This is a placeholder for the actual API call.
export async function getLastLoginTime(userId: string) {
  // Simulate API call for a specific user
  if (userId === '7884057484') {
    return {
      LoginServices: [
        {
          Lastlogintime: '2025-11-20 11:44:19.0',
        },
      ],
      opstatus: 0,
      httpStatusCode: 200,
    };
  } else {
    return {
      opstatus: 1,
      httpStatusCode: 404,
      message: 'User not found',
    };
  }
}
