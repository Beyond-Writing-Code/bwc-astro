# DreamHost User Configuration

## Overview

This project deploys to beyondwritingcode.com on DreamHost:

| Aspect          | bwc-astro                        |
| --------------- | -------------------------------- |
| **Host**        | DreamHost server                 |
| **User**        | `main_user`                      |
| **SSH Key**     | `DREAMHOST_MAIN_SSH_PRIVATE_KEY` |
| **Remote Path** | `~/beyondwritingcode.com`        |
| **Domain**      | beyondwritingcode.com            |

## GitHub Secrets

Required secrets for deployment:

- `DREAMHOST_SSH_HOST`
- `DREAMHOST_MAIN_SSH_USER`
- `DREAMHOST_MAIN_REMOTE_PATH`
- `DREAMHOST_MAIN_SSH_PRIVATE_KEY`

## Security Best Practices

1. **Never commit keys to git** - Use GitHub Secrets only
2. **Test SSH access** - Verify connection works independently
3. **Keep authorized_keys secure** - Maintain `~/.ssh/authorized_keys` with correct permissions

## Testing Deployment

```bash
ssh main_user@dreamhost-server.dreamhost.com
pwd  # Should show /home/main_user
ls ~/beyondwritingcode.com
```

## Quick Reference

1. Verify SSH key is added to DreamHost `~/.ssh/authorized_keys`
2. Check file permissions: `chmod 600 ~/.ssh/authorized_keys`
3. Test SSH connection works without password
4. Verify paths exist for deployment
