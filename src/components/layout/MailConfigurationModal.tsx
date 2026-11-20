'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff, Save, X, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MailConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MailConfigurationModal({ isOpen, onClose }: MailConfigurationModalProps) {
  const [mailId, setMailId] = useState('');
  const [mailPassword, setMailPassword] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [imapHost, setImapHost] = useState('');
  const [imapPort, setImapPort] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const savedConfig = localStorage.getItem('mail_configuration');
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setMailId(parsed.mailId || '');
          setMailPassword(parsed.mailPassword || '');
          setSmtpHost(parsed.smtpHost || '');
          setSmtpPort(parsed.smtpPort || '');
          setImapHost(parsed.imapHost || '');
          setImapPort(parsed.imapPort || '');
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const config = {
        mailId,
        mailPassword,
        smtpHost,
        smtpPort,
        imapHost,
        imapPort,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('mail_configuration', JSON.stringify(config));
      }
      toast.success('Mail configuration saved successfully');
      onClose();
    } catch (err: any) {
      toast.error('Failed to save mail configuration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Mail className="h-5 w-5 text-primary" />
            Mail Configuration
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="mailId">Email Address</Label>
            <Input
              id="mailId"
              type="email"
              placeholder="user@example.com"
              value={mailId}
              onChange={(e) => setMailId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mailPassword">Password / App Password</Label>
            <div className="relative">
              <Input
                id="mailPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={mailPassword}
                onChange={(e) => setMailPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                placeholder="smtp.example.com"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                placeholder="587"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="imapHost">IMAP Host</Label>
              <Input
                id="imapHost"
                placeholder="imap.example.com"
                value={imapHost}
                onChange={(e) => setImapHost(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imapPort">IMAP Port</Label>
              <Input
                id="imapPort"
                placeholder="993"
                value={imapPort}
                onChange={(e) => setImapPort(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="h-4 w-4 mr-1.5" />
              Save Configuration
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
