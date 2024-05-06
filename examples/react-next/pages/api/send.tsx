import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log(req.query.signingPayloadJson);

  const response = await fetch('https://platform.canary.enjin.io/graphql', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'your-api-key',
    },
    body: JSON.stringify({
      query: `mutation SendTransaction($id: Int!, $signingPayloadJson: Object!, $signature: String!) {
        SendTransaction(id: $id, signingPayloadJson: $signingPayloadJson, signature: $signature)
    }`,
      variables: {
        id: Number.parseInt(req.query.id),
        signingPayloadJson: JSON.parse(req.query.signingPayloadJson),
        signature: req.query.signature
      }
    })
  });

  const data = await response.json();

  res.status(200).json(data)
}