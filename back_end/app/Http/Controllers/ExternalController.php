<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class ExternalController extends Controller
{
    public function quote()
    {
        try {
            $resp = Http::timeout(5)
                ->retry(2, 300)
                ->acceptJson()
                ->get('https://api.adviceslip.com/advice');

            if ($resp->ok()) {
                $d    = $resp->json();
                $text = $d['slip']['advice'] ?? null;

                if ($text) {
                    return response()->json([
                        'text'   => $text,
                        'author' => 'AdviceSlip',
                        'source' => 'https://api.adviceslip.com/advice',
                    ], 200);
                }
            }
        } catch (\Throwable $e) {
            // Ignorišemo grešku i vraćamo fallback ispod
        }

        // Fallback — takođe 200 da frontend ne upada u catch
        return response()->json([
            'text'   => 'Uči danas, uspeh dolazi sutra.',
            'author' => 'eLearn',
            'source' => 'local-fallback',
        ], 200);
    }
}


