# Deployment Setup Checklist

Follow these steps to configure automatic deployment to beyondwritingcodebook.com

**Note:** This site uses a **different DreamHost user** than bwc-web:
- ✅ Same DreamHost host server
- ❗ Different SSH username
- ❗ Different SSH keys
- ❗ Different folder path

## Step 1: Get DreamHost Information

You'll need these from your DreamHost account for **beyondwritingcodebook.com**:

- [ ] SSH hostname - **Same as bwc-web** (e.g., `yourserver.dreamhost.com`)
- [ ] SSH username - **Different from bwc-web** (e.g., `bookuser`)
- [ ] Site directory path - **Different from bwc-web** (e.g., `~/beyondwritingcodebook.com`)

## Step 2: Set Up SSH Key for Deployment

**Important:** This site uses **different SSH keys** than bwc-web because it's a different DreamHost user.

### Option A: Use Existing SSH Key for This User

If you already have an SSH key for the beyondwritingcodebook.com user:

```bash
# Display your private key for THIS user
cat ~/.ssh/id_rsa_bookuser  # Or whatever key file you use
# Copy the ENTIRE output (including -----BEGIN/END----- lines)
```

### Option B: Generate New SSH Key (Recommended)

Generate a separate key specifically for beyondwritingcodebook.com deployment:

```bash
# Generate new SSH key (no passphrase for automation)
ssh-keygen -t rsa -b 4096 -C "github-deploy-beyondwritingcodebook" -f ~/.ssh/dreamhost_bwc_book

# This creates two files:
# - ~/.ssh/dreamhost_bwc_book (private key - for GitHub)
# - ~/.ssh/dreamhost_bwc_book.pub (public key - for DreamHost)
```

**Note:** Do NOT reuse the bwc-web SSH key - this is a different user!

### Add Public Key to DreamHost

1. **SSH into DreamHost with the beyondwritingcodebook.com user:**
   ```bash
   ssh BOOK_USERNAME@YOUR_SERVER.dreamhost.com
   # Use the credentials for beyondwritingcodebook.com (NOT bwc-web user)
   ```

2. **Add public key to this user's authorized_keys:**
   ```bash
   # Create .ssh directory if it doesn't exist
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh

   # Add public key
   cat >> ~/.ssh/authorized_keys
   # Paste your PUBLIC key (dreamhost_bwc_book.pub content), then Ctrl+D

   # Or from your local machine:
   cat ~/.ssh/dreamhost_bwc_book.pub | ssh BOOK_USERNAME@YOUR_SERVER.dreamhost.com 'cat >> ~/.ssh/authorized_keys'
   ```

3. **Set correct permissions:**
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

4. **Test SSH connection:**
   ```bash
   ssh -i ~/.ssh/dreamhost_bwc_book BOOK_USERNAME@YOUR_SERVER.dreamhost.com
   # Should connect without password
   # Verify you're logged in as the BOOK user, not the bwc-web user
   whoami  # Should show the book username
   ```

## Step 3: Add Secrets to GitHub

Go to: https://github.com/Beyond-Writing-Code/bwc-astro/settings/secrets/actions

Click **New repository secret** for each:

### Secret 1: DREAMHOST_SSH_HOST
- **Name:** `DREAMHOST_SSH_HOST`
- **Value:** Your DreamHost server hostname (**same as bwc-web**)
- **Example:** `ginseng.dreamhost.com`

### Secret 2: DREAMHOST_BWC_BOOK_SSH_USER
- **Name:** `DREAMHOST_BWC_BOOK_SSH_USER`
- **Value:** SSH username for beyondwritingcodebook.com (**different from bwc-web**)
- **Example:** `bookuser`
- **Note:** This is NOT the same as the bwc-web user

### Secret 3: DREAMHOST_BWC_BOOK_REMOTE_PATH
- **Name:** `DREAMHOST_BWC_BOOK_REMOTE_PATH`
- **Value:** Full path to site directory (**different from bwc-web**)
- **Example:** `~/beyondwritingcodebook.com` or `~/beyondwritingcodebook.com/public_html`

To find your remote path, SSH to DreamHost **as the book user** and run:
```bash
ssh BOOK_USERNAME@YOUR_SERVER.dreamhost.com
cd ~/beyondwritingcodebook.com  # or wherever your site is
pwd  # Shows full path - use this value
```

### Secret 4: DREAMHOST_BWC_BOOK_SSH_PRIVATE_KEY
- **Name:** `DREAMHOST_BWC_BOOK_SSH_PRIVATE_KEY`
- **Value:** Contents of your private key file (**different from bwc-web key**)

Get the value:
```bash
# If using existing key for book user
cat ~/.ssh/id_rsa_bookuser  # Or your existing key

# If using new key (recommended)
cat ~/.ssh/dreamhost_bwc_book
```

**IMPORTANT:**
- Copy the ENTIRE output including these lines:
```
-----BEGIN OPENSSH PRIVATE KEY-----
... (all content) ...
-----END OPENSSH PRIVATE KEY-----
```
- This should be a **different key** than what bwc-web uses
- Do NOT reuse the bwc-web deployment key

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
