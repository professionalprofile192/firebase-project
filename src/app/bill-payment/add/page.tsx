'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function AddUtilityBillPage() {
    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold">Add Utility Bill</h1>
                </div>

                <Card className="w-full">
                    <CardContent className="p-6">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="biller-type">Biller Type *</Label>
                                    <Select>
                                        <SelectTrigger id="biller-type">
                                            <SelectValue placeholder="Water and Severage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="water-sewerage">Water and Severage</SelectItem>
                                            <SelectItem value="electricity">Electricity</SelectItem>
                                            <SelectItem value="gas">Gas</SelectItem>
                                            <SelectItem value="telecom">Telecom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="biller-institution">Biller Institution *</Label>
                                    <Select>
                                        <SelectTrigger id="biller-institution">
                                            <SelectValue placeholder="Select Biller Institution" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kwsb">K-Water & Sewerage Board</SelectItem>
                                            <SelectItem value="ke">K-Electric</SelectItem>
                                            <SelectItem value="ssgc">Sui Southern Gas Company</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="consumer-id">Consumer / Account # *</Label>
                                    <Input id="consumer-id" placeholder="Consumer ID" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nick-name">Nick Name *</Label>
                                    <Input id="nick-name" placeholder="Enter Nick Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="home">Home</SelectItem>
                                            <SelectItem value="office">Office</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                                <AlertDescription>
                                    Note: Online bill payment for all utility company billers to be made by their bill due dates. However, it is recommended to pay bills two working days prior to their due dates to avoid late payment charges in the case where the payment may get rejected or reversed in two working days from the billers end.
                                </AlertDescription>
                            </Alert>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="outline" asChild>
                                    <Link href="/bill-payment">Cancel</Link>
                                </Button>
                                <Button type="submit">Continue</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </DashboardLayout>
    )
}
