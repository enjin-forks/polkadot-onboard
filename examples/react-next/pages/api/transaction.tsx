import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const walletResponse = await fetch('https://platform.canary.enjin.io/graphql', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'your-api-key',
    },
    body: JSON.stringify({
      query: `query GetWallet($account: String!) {
        GetWallet(account: $account) {
            nonce
        }
    }`,
      variables: {
        account: req.query.address
      }
    })
  });

  const walletData = await walletResponse.json();
  const nonce = walletData.data?.GetWallet?.nonce ?? 0;

  const response = await fetch('https://platform.canary.enjin.io/graphql', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'your-api-key',
    },
    body: JSON.stringify({
      query: `mutation CreateCollection($nonce: Int!, $signingAccount: String!) {
        CreateCollection(
            mintPolicy: { forceSingleMint: false },
            signingAccount: $signingAccount
        ) {
            id
            signingPayloadJson(nonce: $nonce)
        }
    }`,
      variables: {
        signingAccount: req.query.address,
        nonce: nonce
      }
    })
  });

  const data = await response.json();

  res.status(200).json(data)
}