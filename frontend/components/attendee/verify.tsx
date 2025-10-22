"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Header } from "@/components/header"
import Link from "next/link"

export default function VerifyPage() {
  const [txHash, setTxHash] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean
    eventTitle?: string
    attendeeAddress?: string
    timestamp?: Date
  } | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)

    // Simulate blockchain verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock verification result
    setVerificationResult({
      verified: true,
      eventTitle: "Web3 Developer Conference 2025",
      attendeeAddress: "0x1234...5678",
      timestamp: new Date(),
    })

    setIsVerifying(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Verify Attendance</CardTitle>
              <CardDescription>Verify blockchain proof-of-attendance using a transaction hash</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="txHash">Transaction Hash</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="txHash"
                      placeholder="0x..."
                      className="pl-10"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full gradient-emerald-teal text-white hover:opacity-90 h-12"
                >
                  {isVerifying ? "Verifying..." : "Verify on Blockchain"}
                </Button>
              </form>

              {verificationResult && (
                <div
                  className={`p-6 rounded-lg border-2 ${
                    verificationResult.verified
                      ? "bg-green-50 border-green-500 dark:bg-green-950/20"
                      : "bg-red-50 border-red-500 dark:bg-red-950/20"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {verificationResult.verified ? (
                      <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {verificationResult.verified ? "Attendance Verified" : "Verification Failed"}
                      </h3>
                      {verificationResult.verified ? (
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Event:</span> {verificationResult.eventTitle}
                          </p>
                          <p>
                            <span className="font-medium">Attendee:</span> {verificationResult.attendeeAddress}
                          </p>
                          <p>
                            <span className="font-medium">Timestamp:</span>{" "}
                            {verificationResult.timestamp?.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm">
                          This transaction hash could not be verified. Please check the hash and try again.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
