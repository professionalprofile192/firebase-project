'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Mail, X, Facebook, Linkedin, Twitter } from "lucide-react";

interface ContactInfoCardProps {
    onClose: () => void;
}

export function ContactInfoCard({ onClose }: ContactInfoCardProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-sm relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
                <CardContent className="pt-10 flex flex-col items-center text-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-primary">
                        <Mail className="h-6 w-6" />
                    </div>
                    
                    <div>
                        <p className="text-sm text-muted-foreground">UBL Helpline</p>
                        <a href="tel:021111825888" className="text-lg font-semibold text-primary">021 111 825 888</a>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a href="https://www.ubldigital.com" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-primary">ubldigital.com</a>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href="mailto:customer.services@ubl.com.pk" className="text-lg font-semibold text-primary break-all">customer.services@ubl.com.pk</a>
                    </div>
                    
                    <div>
                        <p className="text-sm text-muted-foreground">Mailing Address</p>
                        <p className="font-medium text-foreground">Customer Care, 1st Floor UBL warehouse building, Mai Kolachi road, Karachi, Pakistan.</p>
                    </div>

                    <div className="pt-2">
                        <p className="text-sm text-muted-foreground">Social Media</p>
                        <div className="flex gap-4 mt-2">
                            <a href="https://www.facebook.com/UBLUnitedBankLtd/" aria-label="Facebook"  target="_blank"rel="noopener noreferrer">
                                <Facebook className="h-6 w-6 text-gray-600 hover:text-primary" />
                            </a>
                            <a href="https://x.com/UBLDigital?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" aria-label="Twitter"  target="_blank"rel="noopener noreferrer">
                                <Twitter className="h-6 w-6 text-gray-600 hover:text-primary" />
                            </a>
                            <a href="https://pk.linkedin.com/company/united-bank-limited?original_referer=https%3A%2F%2Fwww.google.com%2F" aria-label="LinkedIn"  target="_blank"rel="noopener noreferrer">
                                <Linkedin className="h-6 w-6 text-gray-600 hover:text-primary" />
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
