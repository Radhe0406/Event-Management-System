$headers = @{
    "apikey" = "sb_publishable_rDLmgsmrljmbaImN3o7aqA_7XvL_uwm"
    "Authorization" = "Bearer sb_publishable_rDLmgsmrljmbaImN3o7aqA_7XvL_uwm"
}

Write-Host "=== Testing Supabase Connection ==="

# Test 1: Check if events table exists
Write-Host "`n--- Test: Events table ---"
try {
    $response = Invoke-RestMethod -Uri "https://wienvfiohuirswrgbihq.supabase.co/rest/v1/events?select=id,title,available_seats&limit=5" -Headers $headers -Method GET
    Write-Host "SUCCESS - Events found:" $response.Count
    foreach ($event in $response) {
        Write-Host "  -" $event.title "(" $event.available_seats "seats)"
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode
    $errorBody = ""
    try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
    } catch {}
    Write-Host "ERROR: Status=$statusCode Body=$errorBody"
}

# Test 2: Check if profiles table exists
Write-Host "`n--- Test: Profiles table ---"
try {
    $response = Invoke-RestMethod -Uri "https://wienvfiohuirswrgbihq.supabase.co/rest/v1/profiles?select=id&limit=1" -Headers $headers -Method GET
    Write-Host "SUCCESS - Profiles table exists"
} catch {
    $statusCode = $_.Exception.Response.StatusCode
    $errorBody = ""
    try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
    } catch {}
    Write-Host "ERROR: Status=$statusCode Body=$errorBody"
}

# Test 3: Check if bookings table exists
Write-Host "`n--- Test: Bookings table ---"
try {
    $response = Invoke-RestMethod -Uri "https://wienvfiohuirswrgbihq.supabase.co/rest/v1/bookings?select=id&limit=1" -Headers $headers -Method GET
    Write-Host "SUCCESS - Bookings table exists"
} catch {
    $statusCode = $_.Exception.Response.StatusCode
    $errorBody = ""
    try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
    } catch {}
    Write-Host "ERROR: Status=$statusCode Body=$errorBody"
}

Write-Host "`n=== Done ==="
