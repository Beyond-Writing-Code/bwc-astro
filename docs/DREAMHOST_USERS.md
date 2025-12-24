# DreamHost User Configuration

## Overview

This project uses **different DreamHost credentials** than bwc-web:

| Aspect          | bwc-web                          | bwc-astro                                        |
| --------------- | -------------------------------- | ------------------------------------------------ |
| **Host**        | Same DreamHost server            | Same DreamHost server                            |
| **User**        | `qwp_user`                       | `book_user` (different)                          |
| **SSH Key**     | `DREAMHOST_QWP_SSH_PRIVATE_KEY`  | `DREAMHOST_BWC_BOOK_SSH_PRIVATE_KEY` (different) |
| **Remote Path** | `~/quietwoodspath.com`           | `~/beyondwritingcodebook.com` (different)        |
| **Domain**      | quietwoodspath.com (old staging) | beyondwritingcodebook.com (new staging)          |

## Why Different Users?

- Different site ownership
- Different folder permissions
- Isolated SSH access
- Separate deployment credentials

## Shared GitHub Secrets

Only one secret is shared between both projects:

- ✅ `DREAMHOST_SSH_HOST` - Same server for both sites

## Unique GitHub Secrets

Each project has its own:

### bwc-web (React/Vite)

- `DREAMHOST_QWP_SSH_USER`
- `DREAMHOST_QWP_REMOTE_PATH`
- `DREAMHOST_QWP_SSH_PRIVATE_KEY`

### bwc-astro

- `DREAMHOST_BWC_BOOK_SSH_USER`
- `DREAMHOST_BWC_BOOK_REMOTE_PATH`
- `DREAMHOST_BWC_BOOK_SSH_PRIVATE_KEY`

## Security Best Practices

1. **Never share SSH keys between users** - Each user has their own key
2. **Never commit keys to git** - Use GitHub Secrets only
3. **Test SSH access separately** - Verify each user can connect independently
4. **Keep authorized_keys clean** - Each user maintains their own `~/.ssh/authorized_keys`

## Testing Each User

### Test bwc-web user:

```bash
ssh qwp_user@dreamhost-server.dreamhost.com
pwd  # Should show /home/qwp_user
ls ~/quietwoodspath.com
```

### Test bwc-astro user:

```bash
ssh book_user@dreamhost-server.dreamhost.com
pwd  # Should show /home/book_user
ls ~/beyondwritingcodebook.com
```

## Common Pitfalls

❌ **Don't do this:**

- Using the same SSH key for both users
- Copying bwc-web secrets to bwc-astro
- SSHing as wrong user and wondering why paths don't exist

✅ **Do this:**

- Generate separate SSH keys
- Set up separate GitHub secrets
- Test each user's SSH access independently
- Verify paths exist for each user

## Quick Reference

When setting up deployment for bwc-astro:

1. **DO reuse:** `DREAMHOST_SSH_HOST` (same server)
2. **DON'T reuse:** User, keys, or paths (all different)
3. **Verify:** You're SSHing as the correct user before testing paths
4. **Check:** `whoami` after SSH to confirm you're the right user
