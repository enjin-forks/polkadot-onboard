import styles from 'styles/Home.module.css';

const shorten = (str: string) => {
  let size = 10;
  let result = str;
  if (str && str.length > 2 * size) {
    let start = str.slice(0, size);
    let end = str.slice(-size);
    result = `${start}...${end}`;
  }
  return result;
};

interface AccountBoxParams {
  account: { address: string; name: string };
  signer: any;
  api: any;
}

export const AccountBox = ({ api, account, signer }: AccountBoxParams) => {
  const signPlatformTransaction = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();

      try {
        const res = await fetch(
          `api/transaction?address=${account?.address}`,
          {
            method: 'GET',
          }
        );
        const data = await res.json();
        const txId = data?.data?.CreateCollection?.id;
        const payload = data?.data?.CreateCollection?.signingPayloadJson;
        const { signature } = await signer?.signPayload(payload)
        console.log('Signature' + signature);

        const send = await fetch(
          `api/send?id=${txId}&signingPayloadJson=${JSON.stringify(payload)}&signature=${signature}`,
          {
            method: 'GET',
          }
        );
        const sendData = await send.json();
        console.log(sendData);

      } catch (err) {
        console.log(err);
      }
  };


  const signTransactionHandler = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (api && account?.address && signer) {
      const decimals = api.registry.chainDecimals[0];

      await api.tx.system.remark('I am signing this transaction!').signAndSend(account.address, { signer }, () => {
        // do something with result
      });
    }
  };
  const signMessageHandler = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const signRaw = signer?.signRaw;

    if (!!signRaw && account?.address) {
      const { signature } = await signRaw({
        address: account.address,
        data: 'I am signing this message',
        type: 'bytes',
      });
    }
  };

  return (
    <div className={`${styles.card} ${styles.account}`}>
      <div className={`${styles.name}`}>{shorten(account?.name)}</div>
      <div className={`${styles.address}`}>{shorten(account?.address)}</div>
      <div className={`${styles.flex} ${styles.column}`}>
        <button className={`${styles.btn} ${styles.small}`} onClick={(e) => signTransactionHandler(e)}>
          Submit Transaction with Polkadot.JS
        </button>
        <button className={`${styles.btn} ${styles.small}`} onClick={(e) => signPlatformTransaction(e)}>
          Submit Transaction with Platform
        </button>
      </div>
    </div>
  );
};
