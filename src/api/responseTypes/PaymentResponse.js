/* @flow */
export type PaymentResponse = {
  Payment: {
    id: number,
    created: ?Date,
    updated: ?Date,
    monetary_account_id: ?number,
    amount: ?{
      currency: ?string,
      value: ?string,
    },
    description: ?string,
    type: ?string,
    merchant_reference: ??string,
    alias: ?{
      iban: ?string,
      is_light: ?false,
      display_name: ?string,
      avatar: ?{
        uuid: ?string,
        image: ?[{
          attachment_public_uuid: ?string,
          height: ?number,
          width: ?number,
          content_type: ?string,
        }],
        anchor_uuid: ??string
      },
      label_user: ?{
        uuid: ?string,
        display_name: ?string,
        country: ?string,
        avatar: ?{
          uuid: ?string,
          image: ?Object,
          anchor_uuid: ??string
        },
        public_nick_name: ?string
      },
      country: ?string
    },
    attachment: ??Array<any>,
    geolocation: ??string,
    batch_id: ??string,
    allow_chat: ?bool,
    scheduled_id: ??string,
    address_billing: ??string,
    address_shipping: ??string,
  },
}
