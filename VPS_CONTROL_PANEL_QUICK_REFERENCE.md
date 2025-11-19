# VPS Control Panel - Quick Reference Guide

## 🎛️ Control Functions Overview

### Power Management (Always Visible)
```
┌─────────────────────────────────────────────────────┐
│  Power Management                                   │
├─────────────────────────────────────────────────────┤
│  [Start] [Reboot] [Password] [Reinstall] [Console] │
│  or                                                 │
│  [Stop]  [Reboot] [Password] [Reinstall] [Console] │
└─────────────────────────────────────────────────────┘
```

### Server Management (Always Visible)
```
┌────────────────────────────────────────────────────────┐
│  Server Management                                     │
├────────────────────────────────────────────────────────┤
│  [Snapshot] [Backup] [Resize] [Firewall] [IP] [Destroy]│
└────────────────────────────────────────────────────────┘
```

## 📱 Button Colors & Icons

| Button | Color | Icon | Action |
|--------|-------|------|--------|
| Start | 🟢 Green | ⚡ Power | Boot server |
| Stop | 🔴 Red | ⭘ PowerOff | Shutdown server |
| Reboot | 🟠 Orange | ↻ RefreshCw | Restart server |
| Password | 🟡 Yellow | 🔑 Key | Change root password |
| Reinstall OS | 🔵 Blue | ⟲ RotateCcw | Reinstall operating system |
| Console | 🟣 Purple | ▶ Terminal | Web console access |
| Snapshot | 🩵 Cyan | 📷 Camera | Create point-in-time snapshot |
| Backup | 💙 Indigo | 💾 Database | Manage backups |
| Resize | 🧊 Teal | ⛶ Maximize2 | Scale resources |
| Firewall | 🩷 Pink | 🛡️ Shield | Configure firewall rules |
| IP Config | 💜 Violet | 🌐 Globe | Manage IP addresses |
| Destroy | 🔴 Red | 🗑️ Trash2 | Delete server permanently |

## 🔧 Quick Actions

### Start a Stopped Server
1. Click green **[Start]** button
2. Wait for status to change to "active"
3. Server boots in 30-60 seconds

### Stop a Running Server
1. Click red **[Stop]** button
2. Server performs graceful shutdown
3. Status changes to "stopped"

### Change Root Password
1. Click yellow **[Password]** button
2. Enter new password (min 12 characters)
3. Click "Change Password"
4. Password updates immediately

### Reinstall Operating System
1. Click blue **[Reinstall OS]** button
2. Read warning (all data will be deleted!)
3. Select new OS from grid
4. Click "Reinstall OS"
5. Wait 5-10 minutes for completion

## 💾 Data Protection

### Create a Snapshot
1. Click cyan **[Snapshot]** button
2. Review snapshot info
3. Click "Create Snapshot"
4. Snapshot captures current state

### Manual Backup
1. Click indigo **[Backup]** button
2. Click "Create Manual Backup Now"
3. Backup process starts
4. View in backup list when complete

### Restore from Backup
1. Click indigo **[Backup]** button
2. Find desired backup in list
3. Click green **[Restore]** button
4. Confirm restoration
5. Server returns to backup state

## 📡 Network Configuration

### View/Copy IP Address
1. Click violet **[IP Config]** button
2. See primary IPv4 address
3. Click copy icon to copy to clipboard

### Add Additional IP
1. Click violet **[IP Config]** button
2. Click "+ Add Additional IPv4 (₹200/mo)"
3. Confirm purchase
4. New IP assigned instantly

### Enable IPv6
1. Click violet **[IP Config]** button
2. Click "+ Enable IPv6"
3. IPv6 address assigned
4. Configure in server OS

## 🛡️ Security Management

### Configure Firewall
1. Click pink **[Firewall]** button
2. View existing rules (SSH, HTTP, HTTPS)
3. Click "+ Add New Rule"
4. Enter Protocol, Port, Source
5. Rule applies immediately

### Common Firewall Rules
```
SSH:    TCP Port 22   from Anywhere
HTTP:   TCP Port 80   from Anywhere
HTTPS:  TCP Port 443  from Anywhere
MySQL:  TCP Port 3306 from Specific IP
```

## 📈 Scaling

### Resize Server (Upgrade/Downgrade)
1. Click teal **[Resize]** button
2. Review current plan
3. Select new plan
4. Review price change
5. Click "Resize Server"
6. Server powers off automatically
7. Resize completes in 5-10 minutes
8. Server starts with new resources

### Available Sizes
- Small: 1 vCPU, 8GB RAM, 80GB Storage
- Medium: 2 vCPU, 16GB RAM, 160GB Storage
- Large: 4 vCPU, 32GB RAM, 320GB Storage
- XLarge: 8 vCPU, 64GB RAM, 640GB Storage

## ⚠️ Destructive Actions

### Destroy Server Permanently
1. Click red **[Destroy]** button at the bottom
2. Read severe warning
3. Type "DELETE" in confirmation field
4. Click "Destroy Server"
5. All data, snapshots, configs deleted
6. **This cannot be undone!**

## 🎯 Best Practices

### Before Major Updates
1. Create snapshot: **[Snapshot]** button
2. Or create backup: **[Backup]** button
3. Then perform update
4. Keep snapshot for 24 hours
5. Delete if update successful

### Regular Maintenance
1. Weekly: Check firewall rules
2. Monthly: Create manual backup
3. Quarterly: Review and resize if needed
4. Annually: Update OS to latest version

### Security Checklist
- [ ] Change default root password
- [ ] Configure firewall rules
- [ ] Disable root SSH (use sudo user)
- [ ] Enable automatic security updates
- [ ] Set up monitoring alerts
- [ ] Regular backup schedule

## 📞 Support Actions

### Emergency Console Access
1. Click purple **[Console]** button
2. Web terminal opens
3. Login with root credentials
4. Diagnose issues
5. Fix problems without SSH

### Recovery from Locked Out
1. Click purple **[Console]** button
2. Access via web terminal
3. Or click yellow **[Password]** button
4. Reset root password
5. Regain SSH access

## 💡 Pro Tips

### Snapshot vs Backup
- **Snapshot**: Instant, point-in-time, perfect for testing
- **Backup**: Full copy, slower, better for long-term storage

### When to Resize
- CPU at 80%+ for extended periods
- RAM usage consistently high
- Disk space running low
- App performance degrading

### Firewall Strategy
- Start restrictive (deny all)
- Add only necessary rules
- Use specific IPs when possible
- Regular audit of rules

### Cost Optimization
- Resize down during low-traffic periods
- Remove unused snapshots
- Delete old backups
- Remove extra IPs if not needed

## 🔗 Related Features

### From Server List
- Click "Details" to see full server info
- Click "Go to Server Management" for this control panel

### From Dashboard
- Navigate to "My Servers"
- Select server
- All controls available here

## 📊 Status Indicators

| Status | Color | Icon | Meaning |
|--------|-------|------|---------|
| Active | Green | ✓ | Server running normally |
| Stopped | Red | ✗ | Server powered off |
| Provisioning | Blue | ⏰ | Server being created |
| Error | Red | ⚠ | Server has issues |

## ⌨️ Keyboard Shortcuts (Future)

Coming soon:
- `Ctrl+P`: Power menu
- `Ctrl+S`: Create snapshot
- `Ctrl+B`: Create backup
- `Esc`: Close any modal

## 📱 Mobile Experience

All features work perfectly on mobile:
- 2-column button layout
- Touch-optimized buttons
- Vertical stacking on small screens
- Swipe to dismiss modals
- Full feature parity with desktop

## 🎓 Learning Path

1. **Beginner**: Start/Stop, Reboot, Password
2. **Intermediate**: Snapshots, Backups, Firewall
3. **Advanced**: Resize, IP Config, Multiple servers
4. **Expert**: API integration, Automation, Orchestration

## 🆘 Troubleshooting

### Server Won't Start
1. Check status indicator
2. Click **[Console]** to see logs
3. Review recent changes
4. Restore from backup if needed

### Lost Root Password
1. Click **[Password]** button
2. Set new password
3. Access via SSH or console

### Running Out of Space
1. Check current disk usage
2. Delete unnecessary files
3. Or click **[Resize]** to upgrade storage

### Network Issues
1. Check **[Firewall]** rules
2. Verify **[IP Config]** settings
3. Test from console

---

**Need Help?** Open a support ticket from the Dashboard → Support section.

**Quick Demo?** Visit the documentation at Dashboard → Docs → User Guide → Server Management.
