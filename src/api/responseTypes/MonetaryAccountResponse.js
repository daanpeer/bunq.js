/* @flow */
export type MonetaryAccountResponse = {
  MonetaryAccountBank: {
    id: number,
    created: ?string,
    updated: ?string,
    alias: ?[
      {
        type: ?string,
        value: ?string,
        name: ?string,
      }
    ],
    avatar: ?{
      uuid: ?string,
      image: ?{
        attachment_public_uuid: ?string,
        height: ?number,
        width: ?number,
        content_type: ?string,
      },
      anchor_uuid: ?string
    },
    balance: ?{
      currency: ?string,
      value: ?number,
    },
    country: ?string,
    currency: ?string,
    daily_limit: ?{
      currency: ?string,
      value: ?number,
    },
    daily_spent: ?{
      currency: ?string,
      value: ?number,
    },
    description: ?string,
    public_uuid: ?string,
    status: ?string,
    sub_status: ?string,
    timezone: ?string,
    user_id: ?number,
    monetary_account_profile: ?{
      profile_fill: ??string,
      profile_drain: ??string,
      profile_action_required: ?string,
      profile_amount_required: ?{
        currency: ?string,
        value: ?number
      }
    },
    notification_filters: ?Array<any>,
    setting: ?{
      color: ?string,
      default_avatar_status: ?string,
      restriction_chat: ?string,
    },
    overdraft_limit: ?{
      currency: ?string,
      value: ?number
    }
  }
}
