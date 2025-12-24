import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  NDC_BulkPayments?: any[];
  opstatus: number;
  httpStatusCode: number;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ opstatus: 1, httpStatusCode: 405, message: 'Method Not Allowed' });
  }

  try {
    const { token, kuid, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ opstatus: 1, httpStatusCode: 400, message: 'userId is required' });
    }

    const payload = {
      fromAccountNumber: "",    // Hardcoded
      userId,                   // Dynamic from login/user-attributes
      searchString: "",         // Hardcoded
      limit: 10,
      offset: 0
    };

    const response = await fetch(
      'https://prodpk.ubldigital.com/services/data/v1/DCP_BULKFILE_OBJ/operations/NDC_BulkPayments/getBulkFiles',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-kony-authorization': token,
          'x-kony-deviceid': 'C41D72D1-E664-4D19-991E-B15F1F3A3C27',  // Static for now
          'x-kony-api-version': '1.0',
          'x-kony-requestid': `${Date.now()}-bulkfiles`,
          'x-kony-reportingparams': JSON.stringify({
            os: '142.0.0.0',
            did: 'C41D72D1-E664-4D19-991E-B15F1F3A3C27',
            kuid,
            svcid: 'NDC_BulkPayments'
          }),
        },
        body: JSON.stringify({ jsondata: JSON.stringify(payload) }),
      }
    );

    const data = await response.json();

    res.status(200).json({
      NDC_BulkPayments: data?.NDC_BulkPayments || [],
      opstatus: data?.opstatus ?? 1,
      httpStatusCode: data?.httpStatusCode ?? 500
    });
  } catch (error) {
    console.error("GetBulkFiles API error:", error);
    res.status(500).json({ opstatus: 1, httpStatusCode: 500, message: 'Internal Server Error' });
  }
}
