# Deployment Setup Checklist

Follow these steps to configure automatic deployment to beyondwritingcodebook.com

## Step 1: Get DreamHost Information

You'll need these from your DreamHost account:

- [ ] SSH hostname (e.g., `yourserver.dreamhost.com`)
- [ ] SSH username (e.g., `yourusername`)
- [ ] Site directory path (e.g., `~/beyondwritingcodebook.com` or `~/beyondwritingcodebook.com/public_html`)

## Step 2: Set Up SSH Key for Deployment

### Option A: Use Existing SSH Key

If you already have an SSH key for DreamHost:

```bash
# Display your private key
cat ~/.ssh/id_rsa
# Copy the ENTIRE output (including -----BEGIN/END----- lines)
```

### Option B: Generate New SSH Key

If you need a new key for deployment:

```bash
# Generate new SSH key (no passphrase for automation)
ssh-keygen -t rsa -b 4096 -C "github-deploy-beyondwritingcodebook" -f ~/.ssh/dreamhost_bwc_book

# This creates two files:
# - ~/.ssh/dreamhost_bwc_book (private key - for GitHub)
# - ~/.ssh/dreamhost_bwc_book.pub (public key - for DreamHost)
```

### Add Public Key to DreamHost

1. **SSH into DreamHost:**
   ```bash
   ssh YOUR_USERNAME@YOUR_SERVER.dreamhost.com
   ```

2. **Add public key:**
   ```bash
   # If using existing key
   cat >> ~/.ssh/authorized_keys
   # Paste your PUBLIC key (id_rsa.pub content), then Ctrl+D

   # If using new key, from your local machine:
   cat ~/.ssh/dreamhost_bwc_book.pub | ssh YOUR_USERNAME@YOUR_SERVER.dreamhost.com 'cat >> ~/.ssh/authorized_keys'
   ```

3. **Set correct permissions:**
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

4. **Test SSH connection:**
   ```bash
   ssh -i ~/.ssh/dreamhost_bwc_book YOUR_USERNAME@YOUR_SERVER.dreamhost.com
   # Should connect without password
   ```

## Step 3: Add Secrets to GitHub

Go to: https://github.com/Beyond-Writing-Code/bwc-astro/settings/secrets/actions

Click **New repository secret** for each:

### Secret 1: DREAMHOST_SSH_HOST
- **Name:** `DREAMHOST_SSH_HOST`
- **Value:** Your DreamHost server hostname
- **Example:** `ginseng.dreamhost.com`

### Secret 2: DREAMHOST_BWC_BOOK_SSH_USER
- **Name:** `DREAMHOST_BWC_BOOK_SSH_USER`
- **Value:** Your DreamHost SSH username
- **Example:** `yourusername`

### Secret 3: DREAMHOST_BWC_BOOK_REMOTE_PATH
- **Name:** `DREAMHOST_BWC_BOOK_REMOTE_PATH`
- **Value:** Full path to site directory
- **Example:** `~/beyondwritingcodebook.com` or `~/beyondwritingcodebook.com/public_html`

To find your remote path, SSH to DreamHost and run:
```bash
cd ~/beyondwritingcodebook.com  # or wherever your site is
pwd  # Shows full path
```

### Secret 4: DREAMHOST_BWC_BOOK_SSH_PRIVATE_KEY
- **Name:** `DREAMHOST_BWC_BOOK_SSH_PRIVATE_KEY`
- **Value:** Contents of your private key file

Get the value:
```bash
# If using existing key
cat ~/.ssh/id_rsa

# If using new key
cat ~/.ssh/dreamhost_bwc_book
```

**IMPORTANT:** Copy the ENTIRE output including these lines:
```
-----BEGIN OPENSSH PRIVATE KEY-----
... (all content) ...
-----END OPENSSH PRIVATE KEY-----
```

## Step 4: Verify Deployment Workflow

The workflow is already created at `.github/workflows/deploy.yml`

It will:
1. ✅ Run on every push to `main`
2. ✅ Build the Astro site
3. ✅ Deploy via rsync to beyondwritingcodebook.com

## Step 5: Test Deployment

### Commit and push a small change:

```bash
# Make a small change (or just trigger workflow)
git commit --allow-empty -m "Test deployment to beyondwritingcodebook.com"
git push origin main
```

### Watch the deployment:

1. Go to: https://github.com/Beyond-Writing-Code/bwc-astro/actions
2. Click on the latest workflow run
3. Watch the "Deploy to DreamHost" workflow
4. Check for success ✅

### Verify on site:

1. Visit https://beyondwritingcodebook.com
2. Check that the site loads
3. Verify content is correct
4. Test a few pages

## Step 6: Manual Deployment (Optional)

You can also deploy manually:

### From GitHub Actions:
1. Go to: https://github.com/Beyond-Writing-Code/bwc-astro/actions/workflows/deploy.yml
2. Click "Run workflow"
3. Select `main` branch
4. Click "Run workflow"

### From your local machine:
```bash
# Build
npm run build

# Deploy
rsync -avz --delete dist/ \
  YOUR_USERNAME@YOUR_SERVER.dreamhost.com:~/beyondwritingcodebook.com/
```

## Troubleshooting

### ❌ "Permission denied (publickey)"

**Fix:** Public key not added to DreamHost
1. SSH to DreamHost manually
2. Add public key to `~/.ssh/authorized_keys`
3. Run `chmod 600 ~/.ssh/authorized_keys`

### ❌ "No such file or directory" during deployment

**Fix:** Remote path is incorrect
1. SSH to DreamHost
2. Run `pwd` in site directory
3. Update `DREAMHOST_BWC_BOOK_REMOTE_PATH` secret with correct path

### ❌ Deployment succeeds but site doesn't update

**Fix:** Check these:
1. Verify remote path is correct
2. Check DreamHost logs for errors
3. Clear browser cache (Cmd+Shift+R)
4. Verify files deployed: `ssh HOST ls -la ~/beyondwritingcodebook.com/`

## Security Checklist

- [ ] Private key stored ONLY in GitHub Secrets (not in code)
- [ ] SSH key has no passphrase (for automation)
- [ ] Public key added to DreamHost `~/.ssh/authorized_keys`
- [ ] File permissions correct on DreamHost (600 for authorized_keys, 700 for .ssh)
- [ ] Test SSH connection works without password
- [ ] All four GitHub secrets configured correctly

## Next Steps

Once deployment is working:

1. Update README.md with deployment status
2. Add deployment status badge to README
3. Configure custom domain if needed
4. Set up SSL certificate on DreamHost (if not already configured)
5. Test all site functionality on beyondwritingcodebook.com

## Questions?

See full documentation in: `docs/DEPLOYMENT.md`
