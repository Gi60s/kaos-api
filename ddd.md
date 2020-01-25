# Channels:

## Events

- channel created for unit
- channel updated
- channel archived for unit (no longer can be posted to and discoverability is false, public is true)
- channel restored for unit (unarchive)
- channel deleted for unit (actually delete channel, contents, and associations)
- user roles updated (no roles = not joined, defaults to member, also possible to administer)
- posted to channel
- pinned to channel

## Commands

| Command | Method | URL Path Fragment | Access | Notes |
| ------- | ------ | ----------------- | ------ | ----- |
| Get channels | GET | /units/{unit_id}/channels | Administration, Unit Admin, Unit Member | |
| Get channel details | GET | /channels/{channel_id} | Administration, Unit Admin, Unit Member | |
| Create channel | POST | /units/{unit_id}/channels | Unit Admin | |
| Update channel | PUT | /channels/{channel_id} | Unit Admin | |
| Delete a channel | DELETE | /channels/{channel_id} | Unit Admin | |
| Archive channel | DELETE | /channels/{channel_id}/archive | Unit Admin | Archived channels can be seen but not posted to or joined. |
| Restore channel | PUT | /channels/{channel_id}/archive | Unit Admin | |
| Join a channel | PUT | /channels/{channel_id}/members/{user_id} | User | |
| Leave a channel | DELETE | /channels/{channel_id}/members/{user_id} | User | |
| Post to channel | POST | /channels/{channel_id}/posts | Administration, Network Admin, Unit Admin, User | Can be posted as a user or an entity. | Pin to channel | PUT | /channels/{channel_id}/pins | Unit Admin | |
| Unpin from a channel | DELETE | /channels/{channel_id}/pins | Unit Admin | |

# Posts

## Events

- user or entity made post
- user or entity updated post
- user or entity deleted post
- user or entity reacted to post
- user or entity removed reaction
- user or entity reported a post
- user or entity removed report
- user commented on a post

## Commands

| Command | Method | URL Path Fragment | Access | Notes |
| ------- | ------ | ----------------- | ------ | ----- |
| Broadcast a post | POST | /posts | Administration, Network Admin, Unit Admin | Depending on access a post may go to all channels on all networks, all channels on a network, or all channels in a unit (and optionally sub units). Query string parameters can limit the channels it goes to. |
| Update a post | PUT | /posts/{post_id} | Unit Admin, User | Can only be updated by the unit admin or user who created the post. |
| Delete a post | DELETE | /posts/{post_id} | Unit Admin, User | Can only be deleted by the unit admin or user who created the post. |
| Comment on a post | POST | /posts/{post_id} | Unit Admin, User | A comment is the same as a post and can also be commented on and reacted to. |
| React to a post | PUT | /posts/{post_id}/reactions | User | React to a post; likes, etc. This endpoint can be used to change reactions or remove reactions too. |
| Report a post | PUT | /posts/{post_id}/report | User | Report a post as innapropriate and why. This endpoint can also be used to change or remove the report. |

# Networks

## Events

- network created
- network updated
- network deleted
- unit joined network
- unit left network
- user joined network
- user left network
- venue type added to network
- venue type updated
- venue type removed from network

## Commands

| Command | Method | URL Path Fragment | Access | Notes |
| ------- | ------ | ----------------- | ------ | ----- |
| Create a network | POST | /networks | Administrative | |
| Update a network | PUT | /networks/{network_id} | Administrative, Network Admin | |
| Delete a network | DELETE | /networks/{network_id} | Administrative, Network Admin |
| List networks | GET | /networks | Public | Fieldsets: basic, units, members, venues |
| Get network details | GET | /networks/{network_id} | Public | Fieldsets: basic, units, members, venues |
| Join member to network | PUT | /networks/{network_id}/members/{user_id} | Administrative, User | |
| Remove member from network | DELETE | /networks/{network_id}/members/{user_id} | Administrative, User | |
| Join unit to a network | PUT | /networks/{network_id}/units/{unit_id} |Unit Admin | |
| Remove unit frojm a network | DELETE | /networks/{network_id}/units/{unit_id} | Unit Admin | |
| Create venue type | POST | /networks/{network_id}/venues | Administrative, Network Admin | |
| Update venue type | PUT | /networks/{network_id}/venues/{vunue_id} | Administrative, Network Admin | |
| Delete venue type | DELETE | /networks/{network_id}/venues/{venue_id} |Administrative, Network Admin | |

# Unit:

## Events

- unit created
- unit updated
- unit deleted
- unit joined parent unit
- unit left parent unit
- member joined unit
- member left unit

## Commands

| Command | Method | URL Path Fragment | Access | Notes |
| ------- | ------ | ----------------- | ------ | ----- |
| Create unit | POST | /units | User | |
| Update unit | PUT | /units/{unit_id} | Unit Admin | |
| Delete unit | DELETE | /units/{unit_id} | Unit Admin | |
| List units | GET | /units | User | |
| Get unit details | GET | /units/{unit_id} | User | |
| Join unit to parent unit | PUT | /units/{parent_unit_id}/subUnits/{child_unit_id} | Unit Admin | Can only be performed by a user who is a unit admin for both the child and parent units |
| Unjoin unit from parent unit | DELETE | /units/{parent_unit_id}/subUnits/{child_unit_id} | Unit Admin | Can only be performed by parent unit admin user |
| User unit membership updated | PUT | /units/{unit_id}/members/{user_id} | Unit Admin, User | Unit Admin can give/take membership roles (other than member), User can add/remove member role. |

# User Account:

## Events

- user created
- user updated
- user deleted
- user personal set (same event for update and delete of personal)

## Commands

| Command | Method | URL Path Fragment | Access | Notes |
| ------- | ------ | ----------------- | ------ | ----- |
| Create user | POST | /users | Public | |
| Update user | PUT | /users/{user_id} | User | |
| Update user personal | PUT | /user/{user_id} | User | |
| Delete user | DELETE | /users/{user_id} | Administrative, User | Deleting a user will remove all posts, memberships, and if the sole admin of a unit will also delete that unit. |
| Get user details | GET | /users/{user_id} | Administrative, User | Administrative and own user can see all personal, memberships and roles, notifications, posts, etc. Normal user can only see basic info and basic membership info. |