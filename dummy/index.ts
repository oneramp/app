// Quote
export const quoteResponse = {
  quote: {
    fiatType: "KES",
    cryptoType: "USDC",
    fiatAmount: "112.68",
    cryptoAmount: "5.64",
    country: "KE",
    amountPaid: "6",
    address: "0x240ef8C7Ae6eB6C1A80Da77F5586EeE76d50C589",
    fee: "0.36",
    guaranteedUntil: "2025-05-14T17:41:01.381Z",
    transferType: "TransferIn",
    quoteId: "f6204b44-6089-4f82-8ded-dedb19e278d2",
    network: "celo",
    used: false,
    requestType: "fiat",
    id: "6824d5ada642d48ade8eb3d2",
  },
  kyc: {
    kycRequired: true,
    kycSchemas: [
      {
        kycSchema: "PersonalDataAndDocuments",
        allowedValues: {
          isoCountryCode: ["UG", "KE"],
          isoRegionCode: ["UG", "KE"],
        },
      },
    ],
  },
  fiatAccount: {
    MobileMoney: {
      fiatAccountSchemas: [
        {
          fiatAccountSchema: "MobileMoney",
          userActionType: "AccountNumberUserAction",
          allowedValues: {
            country: ["UG", "KE"],
          },
          institutionName: "OneRamp",
          accountName: "OneRamp",
          accountNumber: "25656",
          transactionReference: "ref-6824d5ada642d48ade8eb3d2",
        },
      ],
      settlementTimeLowerBound: "3600",
      settlementTimeUpperBound: "86400",
    },
  },
};

export const transferInResponse = {
  transferId: "test-6828767f9deeb7f33b1d18ea",
  transferStatus: "TransferStarted",
  transferAddress: "0x523a911918444D03eb9C8aFF5c13D9aa6A44348F",
  userActionDetails: {
    accountNumber: "01111111111",
    accountName: "PAGA",
    transactionReference: "ref-6824d5ada642d48ade8eb3d2",
    userActionType: "AccountNumberUserAction",
    institutionName: "PAGA",
  },
};

export const transferStatusResponse = {
  status: "TransferComplete",
  transferType: "TransferOut",
  fiatType: "UGX",
  cryptoType: "cUSD",
  amountProvided: "3733.70414571",
  amountReceived: "3733.70414571",
  fiatAccountId: "657c100a7b82664faec4588e",
  transferId: "test-6828767f9deeb7f33b1d18ea",
  transferAddress: "0xc0EBB770F2c9CA7169BDc1",
  userActionDetails: {
    userActionType: "AccountNumberUserAction",
    institutionName: "OneRamp",
    accountName: "OneRamp",
    accountNumber: "789456",
    transactionReference: "ref-6828767f9deeb7f33b1d18ea",
  },
};
