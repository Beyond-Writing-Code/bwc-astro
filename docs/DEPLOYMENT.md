# Deployment Guide

## Overview

This site is deployed to **beyondwritingcodebook.com** (staging) on DreamHost using SSH/rsync.

## Automatic Deployment

**Trigger:** Every push to `main` branch

**Process:**

1. GitHub Actions builds the site (`npm run build`)
2. Creates a tarball of the `dist/` directory
3. Uploads to GitHub as artifact
4. Downloads artifact in deploy job
5. Deploys via `rsync` over SSH to DreamHost

**Workflow:** `.github/workflows/deploy.yml`

## Required GitHub Secrets

You need to configure these secrets in GitHub repository settings:

| Secret Name                          | Description               | Example                       |
| ------------------------------------ | ------------------------- | ----------------------------- |
| `DREAMHOST_SSH_HOST`                 | DreamHost server hostname | `yourserver.dreamhost.com`    |
| `DREAMHOST_BWC_BOOK_SSH_USER`        | SSH username              | `yourusername`                |
| `DREAMHOST_BWC_BOOK_REMOTE_PATH`     | Path to site directory    | `~/beyondwritingcodebook.com` |
| `DREAMHOST_BWC_BOOK_SSH_PRIVATE_KEY` | SSH private key           | Contents of `~/.ssh/id_rsa`   |

### How to Set Up Secrets

1. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret with the name and value from the table above

## SSH Key Setup

### Generate SSH Key (if needed)

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "github-deploy-beyondwritingcodebook"
# Save to: ~/.ssh/dreamhost_deploy_beyondwritingcodebook
# Don't set a passphrase (for automation)
```

### Add Public Key to DreamHost

1. **SSH into DreamHost:**

   ```bash
   ssh yourusername@yourserver.dreamhost.com
   ```

2. **Add public key to authorized_keys:**

   ```bash
   cat >> ~/.ssh/authorized_keys
   # Paste your PUBLIC key (id_rsa.pub content)
   # Press Ctrl+D
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Test SSH connection:**
   ```bash
   ssh -i ~/.ssh/dreamhost_deploy_beyondwritingcodebook yourusername@yourserver.dreamhost.com
   ```

### Add Private Key to GitHub Secrets

```bash
# Copy private key content
cat ~/.ssh/dreamhost_deploy_beyondwritingcodebook
# Copy the ENTIRE output (including BEGIN/END lines)
```

Then add to GitHub as `DREAMHOST_BWC_BOOK_SSH_PRIVATE_KEY`

## Manual Deployment

You can trigger deployment manually:

1. Go to **Actions** tab in GitHub
2. Select **Deploy to DreamHost** workflow
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**

## Local Deployment

You can also deploy from your local machine:

```bash
# Build the site
npm run build

# Deploy via rsync (requires SSH key)
rsync -avz --delete dist/ \
  yourusername@yourserver.dreamhost.com:~/beyondwritingcodebook.com/
```

## Verifying Deployment

After deployment:

1. Visit https://beyondwritingcodebook.com
2. Check that content is updated
3. Test critical pages:
   - Home page
   - About page
   - Posts listing
   - Individual post
   - RSS feed: https://beyondwritingcodebook.com/feed.xml

## Troubleshooting

### Deployment fails with "Permission denied"

**Problem:** SSH key not properly configured

**Solution:**

1. Verify SSH key is added to DreamHost `~/.ssh/authorized_keys`
2. Check file permissions: `chmod 600 ~/.ssh/authorized_keys`
3. Verify GitHub secret `DREAMHOST_BWC_BOOK_SSH_PRIVATE_KEY` contains full private key

### Deployment succeeds but site shows old content

**Problem:** Cached files or incorrect path

**Solution:**

1. Verify `DREAMHOST_BWC_BOOK_REMOTE_PATH` points to correct directory
2. SSH into DreamHost and check files: `ls -la ~/beyondwritingcodebook.com/`
3. Clear browser cache and hard reload (Cmd+Shift+R)

### rsync: Host key verification failed

**Problem:** DreamHost host not in known_hosts

**Solution:** The workflow should handle this automatically with `ssh-keyscan`. If issue persists, manually SSH to DreamHost once from your machine.

### Build succeeds but deploy step skipped

**Problem:** Not pushing to `main` branch or workflow conditions not met

**Solution:**

1. Check you're on `main` branch: `git branch`
2. Check workflow conditions in `.github/workflows/deploy.yml`
3. Manually trigger deployment from Actions tab

## Monitoring

### GitHub Actions

Monitor deployments in the **Actions** tab:

- View build logs
- Check deployment status
- See rsync output

### DreamHost Logs

SSH into DreamHost and check logs:

```bash
ssh yourusername@yourserver.dreamhost.com
tail -f ~/logs/yourdomain.com/http/error.log
```

## Rollback

To rollback to a previous version:

1. Go to **Actions** tab in GitHub
2. Find the successful deployment you want to rollback to
3. Click **Re-run all jobs**

Or rollback via git:

```bash
# Find the commit to rollback to
git log --oneline

# Push that commit
git reset --hard COMMIT_SHA
git push origin main --force
```

## Security Considerations

1. **SSH Keys:** Never commit SSH private keys to git
2. **Secrets:** All credentials stored in GitHub Secrets
3. **Key Rotation:** Rotate SSH keys periodically
4. **Access Control:** Limit GitHub Actions permissions to necessary scopes
5. **Known Hosts:** Workflow uses `ssh-keyscan` to verify host identity

## Performance

**Build time:** ~3-5 seconds
**Deployment time:** ~10-20 seconds (depends on changed files)
**Total time:** ~20-30 seconds from push to live

The `--delete` flag in rsync ensures old files are removed, keeping the deployment clean.
